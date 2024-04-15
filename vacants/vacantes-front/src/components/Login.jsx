import Title from "./common/Title"
import {useState} from 'react'
import {Navigate} from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import md5 from "md5"
import Error from "./common/Error"

const Login = () => {
	const [email,setEmail] = useState('')
	const [password,setPassword] = useState('')
	const[loading,setLoading]= useState(false)
	const[error,setError]= useState(false)
	const[goMyOffers,setGoMyOffers]= useState(false)

	const clearFields = (e) => {
		if (e) {
			e.preventDefault();}
		setEmail('')
		setPassword('')

	}

	const login= async (e) => {
		e.preventDefault()


		if ([email,password].includes('') || [email,password].includes('#') ){
			setError(true)
			Swal.fire({
				position: 'center',
				icon:'warning',
				title: "All fields must be filled",
				showConfirmButton: false,
				timer: 2000
			})
			return
		}else setError(false)

		setLoading(true)
		try{
			const {data} = await axios.post(
				'login',
				{
					email,
					password
				}
			)
			Swal.fire({
				position: 'top-end',
				icon:'success',
				html: `welcome <strong>${data.company}</strong>`,
				showConfirmButton: false,
				timer: 2000
			})
			let companyData = {email}
			companyData.id = await data.company_id
			companyData.username = await data.username
			companyData.email = await data.email
			companyData.company = await data.company
			let sessionId = await md5(companyData.id+companyData.email+companyData.username)
			localStorage.setItem('user',JSON.stringify(companyData))
			localStorage.setItem('sessionId',sessionId)
			setGoMyOffers(true)


		}catch(err){
			Swal.fire({
				position: 'top-end',
				icon:'error',
				title: err.message.includes('401')?'Incorrect login data': err.message,
				showConfirmButton: false,
				timer: 2000
			})
		}
		clearFields()
	}

	if (goMyOffers){
		return <Navigate to="/MyOffers"/>
	}


	return (
		<>
			<Title title="Log in"></Title>
			<form onSubmit={login}>
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
									<h5>Log in your Company</h5>
								</div>
								<div className="mb-3">
									<label className="form-label">Company Email</label>
									<input type="email" className="form-control" aria-describedby="Email Name" value={email} onChange={(e) => setEmail(e.target.value)}/>
								</div>
								<div className="mb-3">
									<label className="form-label">Password</label>
									<input type="password" className="form-control" aria-describedby="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
								</div>
								{error && <Error message='Every field is mandatory'></Error>}
								<div className="d-grid">
									<button type="submit" className="btn btn-success">
										Log in
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

export default Login