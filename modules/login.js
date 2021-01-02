/* login.js */

import { generateToken, getCookie, setCookie, showMessage, getLocation,login } from '../js/core.js'
const apiURL = 'https://jackson-relax-8080.codio-box.uk'
const herokuApiUrl = 'https://auction-api-app.herokuapp.com'
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
	document.querySelector('form').addEventListener('submit', async event => await userLogin(event))
}

async function userLogin(event) {
	event.preventDefault()
	try {
		event.preventDefault()
		console.log('inside login function')
		//getting username and password values
		const elements = [...document.forms['login'].elements]
		
		//initializing empty object to store values in
		const data = {}
		elements.forEach( el => {
			if(el.name) data[el.name] = el.value
		})
		// generating a token (base64 encryption)
		const token = generateToken(data.user, data.pass)
		console.log('generated token :',token)
		
		//setting the fetch url with the auth header containing the token	
		const url = `${apiURL}/accounts/login/${data.user}`
		const options = { headers: {Authorization: token }  }
		console.log('the request header', options)
		
		const response = await fetch(url,options)
		const json = await response.json()
		console.log(json)
		const status = response.status
		console.log(`HTTP status code: ${response.status}`)
		if(response.status === 404){			
			alert('Invalid Username or Password')
		} 
		if(response.status === 200) {
			setCookie('authorization', token, 1)
			console.log(getCookie('authorization'))
			window.location.href = '#home'
		}
	} catch(err) {
		console.log(err.message)
	}
}
 
	// {headers: { Authorization: token }, credentials: 'include'  {mode:'cors' }