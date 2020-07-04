let form = document.querySelector('form'),
	topic = document.querySelector('input'),
	content = document.querySelector('textarea'),
	status = document.querySelector('span'),
	posts = document.querySelector('div'),
	modelData = null,
	track = true;

(function () {
	model();
})();

function model() {
	fetch('/serve')
		.then((res) => res.json())
		.then((myJSON) => {
			modelData = myJSON.myDb;
			posts.innerHTML = '';
			view();
		})
		.catch(function (err) {
			status.textContent = err;
		});
}

function view() {
	for (let i = (modelData.length - 1); i >= 0; i--) {
		posts.innerHTML += `<h3>${modelData[i].topic}</h3>
							<p>${modelData[i].content}</p>
							<br/>
							<button id=${i} onclick="update(this)">Modify</button>
							<button id=${i} onclick="remove(this)">Delete</button>
							<hr/>`;
	}
}

function add() {
	status.textContent = '.....Sending';
	fetch('/add', {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				topic: topic.value,
				content: content.value
			})
		})
		.then(function (res) {
			status.textContent = 'Post Sent';
			setTimeout(() => {
				status.textContent = '';
				topic.value = '';
				content.value = '';
			}, 3000);
			return res.json();
		})
		.then(function (data) {
			model();
		})
		.catch(function (err) {
			status.textContent = err;
		});
};

form.addEventListener('submit', function (e) {
	e.preventDefault();
	add();
});

function update(x) {
	if (track === true) {
		topic.value = modelData[+(x.id)].topic;
		content.value = modelData[+(x.id)].content;
		track = false;
	} else {
		status.textContent = '....Modifying';
		fetch('/update', {
				method: 'put',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					toUpdate: x.id,
					topic: topic.value,
					content: content.value
				})
			})
			.then((res) => {
				status.textContent = 'Post Modified';
				setTimeout(() => {
					status.textContent = '';
					topic.value = '';
					content.value = '';
				}, 3000)
				return res.json();
			})
			.then(function (data) {
				model();
			})
			.catch(function (err) {
				status.textContent = err;
			});
		track = true;
	}
}


function remove(x) {
	status.textContent = '.....Deleting';
	fetch('/remove', {
			method: 'delete',
			headers: {
				'content-type': 'application/json'
			},

			body: JSON.stringify({
				toRemove: x.id
			})
		})
		.then((res) => {
			status.textContent = 'Post Deleted';
			setTimeout(function () {
				status.textContent = '';
			}, 5000)
			return res.json();
		})
		.then(function (data) {
			model();
		})
		.catch(function (err) {
			status.textContent = err;
		});
}
