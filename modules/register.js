
/* register.js */

import { showMessage } from '../js/core.js'
const apiURL = 'https://jackson-relax-8080.codio-box.uk'
export async function setup() {
	console.log('Register Main script')
	document.querySelector('h1').innerText = 'Register a New Account'
	document.querySelector('form').addEventListener('submit', await registerAccount)
}

async function registerAccount(event) {
	event.preventDefault()
	try {
		const elements = [...document.forms['register'].elements]
		const data = {}
		elements.forEach( el => { if(el.name) data[el.name] = el.value })
		console.log(data)
		const options = { method: 'post', body: JSON.stringify(data) }
		const url = `${apiURL}/accounts/`
		console.log('options',options)
		const response = await fetch(url,options)
		const json = await response.json()
		if(response.status === 422) throw new Error(`422 Unprocessable Entity: ${json.msg}`)
		window.location.href = '/#login'
	} catch(err) {
		showMessage(err.message)
	}
}
