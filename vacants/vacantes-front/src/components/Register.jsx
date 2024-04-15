import Title from "./common/Title"
import { useState } from "react"
import axios from 'axios'
import Swal from 'sweetalert2'
import Error from "./common/Error"
import md5 from "md5"
import {Navigate} from 'react-router-dom'

const Register = () => {

	const[logo,setLogo]= useState(null)
	const[company,setCompany]= useState('')
	const[username,setUsername]= useState('')
	const[email,setEmail]= useState('')
	const[password,setPassword]= useState('')
	const[passwordConfirm,setPasswordConfirm]= useState('')
	const[loading,setLoading]= useState(false)
	const[error,setError]= useState(false)
	const[goLogin,setGoLogin]= useState(false)


	const prevLogo = (e) => {
		e.preventDefault()
		let reader = new FileReader()
		reader.readAsDataURL(e.target.files[0])
		reader.onload = () => {
			document.getElementById('logo').src = reader.result
			setLogo(reader.result)
		}
	}

	const clearFields = (e) => {
		if (e) {
			e.preventDefault();}
		setCompany('')
		setEmail('')
		setLogo('')
		setPassword('')
		setPasswordConfirm('')
		setUsername('')

	}

	const register= async (e) => {
		e.preventDefault()

		let companyData = {logo,company,username,email}


		if ([logo,company,username,email,password,passwordConfirm].includes('') || [logo,company,username,email,passwordConfirm].includes('#') ){
			setError(true)
			return
		}else if (password!==passwordConfirm){
			setPassword('')
			setPasswordConfirm('')
			Swal.fire({
				position: 'center',
				icon:'warning',
				title: "passwords do not match",
				showConfirmButton: false,
				timer: 1500
			})
			setError(true)
			return
		}else if (password.length<10){
			setPassword('')
			setPasswordConfirm('')
			Swal.fire({
				position: 'center',
				icon:'warning',
				title: "password needs to be 10 characters long",
				showConfirmButton: false,
				timer: 1500
			})
			setError(true)
			return
		}else setError(false)

		setLoading(true)
		try{
			const {data} = await axios.post(
				'company',
				{
					logo,
					company,
					username,
					email,
					password
				}
			)
			Swal.fire({
				position: 'top-end',
				icon:'success',
				title: data.message,
				showConfirmButton: false,
				timer: 1500
			})

			companyData.id = await data.data.insertId
			let sessionId = await md5(companyData.id+companyData.email+companyData.username)
			localStorage.setItem('user',JSON.stringify(companyData))
			localStorage.setItem('sessionId',sessionId)
			setGoLogin(true)


		}catch(err){
			Swal.fire({
				position: 'top-end',
				icon:'error',
				title: err.message,
				showConfirmButton: false,
				timer: 1500
			})
		}
		clearFields()
	}

	if (goLogin){
		return <Navigate to="/MyOffers"/>
	}

	return (
		<>
			<Title title="Register"></Title>
		<form onSubmit={register}>
			<div className="container">
				<div className="row">
					<div className="col-md">
						<img width="100%" src="./../slide1.jpg" alt=""></img>
						<p>Join our talented community and follow each and everyone of our candidatures</p>
						<p>Apply to every offer you see without needing to register over and over again</p>
						<p>Keep yourself updated on new offers of you interest</p>
					</div>
					<div className="col-md card">
						<div className="card-body">
							<div className="card-title text-center border-bottom">
								<h5>Register your Company</h5>
							</div>
							<div className="mb-3 text-center">
								<img width="150" id="logo" src="./../../vite.svg" alt=""></img>
							</div>
							<div className="mb-3">
								<label className="form-label">Company Logo</label>
								<input type="file" className="form-control" aria-describedby="Company Name" onChange={prevLogo}/>
							</div>
							<div className="mb-3">
								<label className="form-label">Company Name</label>
								<input type="text" className="form-control" aria-describedby="Company Name" value={company} onChange={(e) => setCompany(e.target.value)}/>
							</div>
							<div className="mb-3">
								<label className="form-label">User Name</label>
								<input type="text" className="form-control" aria-describedby="User Name" value={username} onChange={(e) => setUsername(e.target.value)}/>
							</div>
							<div className="mb-3">
								<label className="form-label">Company Email</label>
								<input type="email" className="form-control" aria-describedby="Email Name" value={email} onChange={(e) => setEmail(e.target.value)}/>
							</div>
							<div className="mb-3">
								<label className="form-label">Password</label>
								<input type="password" className="form-control" aria-describedby="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
							</div>
							<div className="mb-3">
								<label className="form-label">Confirm Password</label>
								<input type="password" className="form-control" aria-describedby="Password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}/>
							</div>
							{error && <Error message='Every field is mandatory'></Error>}
							<div className="d-grid">
								<button type="submit" className="btn btn-success">
									Register Account
								</button>
								<input onClick={(e) => clearFields(e)} value='Cancelar' type="button" className="btn btn-info my-2"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
		</>
	)
}

export default Register