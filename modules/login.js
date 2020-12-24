/* login.js */

import { generateToken, getCookie, setCookie, showMessage, getLocation } from '../js/core.js'
const apiURL = 'https://jackson-relax-8080.codio-box.uk'

export function setup() {
	console.log('Login Main script')
	const cookie = getCookie('authorization')
	if(getCookie('authorization')) {
		console.log('authorised')
		window.location.href = '/#home'
	}else if (!getCookie('authorization') && document.querySelector('#seller')){
		const seller = document.querySelector('#seller')
		seller.parentNode.removeChild(seller);
	}
	document.querySelector('h1').innerText = 'Log In'
	document.querySelector('form').addEventListener('submit', async event => await login(event))
}

async function login() {
	try {
		event.preventDefault()
		console.log('inside login function')
		const elements = [...document.forms['login'].elements]
		const data = {}
		elements.forEach( el => {
			if(el.name) data[el.name] = el.value
		})
		
		const token = generateToken(data.user, data.pass)
		console.log(token)
		const url = `${apiURL}/accounts/${data.user}`
		const options = {headers: { Authorization: token } }
		
		const response = await fetch(url,options)
		const json = await response.json()
		console.log(json)
		const status = response.status
		console.log(`HTTP status code: ${response.status}`)
		if(response.status === 401) throw new Error(json.msg)
		if(response.status === 200) {
			setCookie('authorization', token, 1)
			window.location.href = '#home'
		}
	} catch(err) {
		showMessage(err.message)
	}
}
 
	// {headers: { Authorization: token }, credentials: 'include'  {mode:'cors' }