import { useEffect, useState, useCallback } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'


const PublicVacancies = () => {

	const [vacancies,setVacancies] = useState([])
	const[loading,setLoading]= useState(false)
	const[page, setPage] = useState(1)
	const[dni, setDni] = useState('')
	const[name, setName] = useState('')
	const[email, setEmail] = useState('')
	const[salary, setSalary] = useState('')
	const[picture, setPicture] = useState('')
	const[job_id, setJob_Id] = useState(0)
	const[persons_id, setPersons_Id] = useState(0)
	const[title, setTitle] = useState("")
	const[error,setError]= useState(false)

	const getVacanciesPublic = useCallback(
		async () => {
			try {
					const { data } = await axios.get(`job/all/${page}/5`);
					setVacancies(data);
			} catch (err) {
				if (!err.message.includes('404')){
					Swal.fire({
						position: 'top-end',
						icon: 'error',
						title: err.message.includes('401') ? 'Datos de inicio de sesión incorrectos' : err.message,
						showConfirmButton: false,
						timer: 2000
					})
				}
			}
			setLoading(false);
		},[page]
	)

	const readPicture = async (e) => {
		try {
			const file = e.target.files[0];
			if (file) {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
							setPicture(reader.result);
					};
			} else {
					console.error("No file selected");
			}
		} catch (error) {
				console.error("Error reading file:", error);
		}
	}

	const cleanPicture = () =>{
		setPicture("")
	}

	const clearFields = (e) => {
		if (e) {
			e.preventDefault();}
		setName('')
		setEmail('')
		setDni('')
		setPicture('')
		setSalary('')
		setJob_Id(0)
		setPersons_Id(0)

	}

	const register= async (e) => {
		e.preventDefault()

		let personData = {dni,name:name,email:email, img: picture}


		if ([dni,name,email,picture].includes('') || [dni,name,email,picture].includes('#') ){
			setError(true)
			Swal.fire({
				position: 'center',
				icon:'error',
				title: "All fields must be filled",
				showConfirmButton: false,
				timer: 1500
			})
			return
		}else setError(false)

		setLoading(true)
		try{
			const {data} = await axios.post(`persons`,personData)
			let idPerson
			setPersons_Id(data.insertId)
			Swal.fire({
				position: 'top-end',
				icon:'success',
				title: data.message,
				showConfirmButton: false,
				timer: 1500
			})
			try{
				idPerson = await data.data.insertId
			}catch(err){
				idPerson = await data.persons_id
			}

			const response = await axios.post(`apply`,{
				job_id,
				persons_id:idPerson,
				salary
			})

			Swal.fire({
				position: 'center',
				icon:'success',
				title: response.data.message,
				showConfirmButton: false,
				timer: 1500
			})

			setLoading(false)
			alert(idPerson)
			clearFields()



		}catch(err){
			Swal.fire({
				position: 'top-end',
				icon:'error',
				title: err.message,
				showConfirmButton: false,
				timer: 1500
			})
		}
		setLoading(false)
		clearFields()
	}

	useEffect(() =>{
		getVacanciesPublic()
	},[page,getVacanciesPublic])


	return (
		<>
			<table className="table table-striped-columns">
				<tbody>
					{vacancies.map((item) => {
						return (
							<tr key={item.job_id}>
								<td className="col-md-3 mb-3 mb-sm-0 align-items-center">
									<div className="card">
										<div className="card-body">
											<h5 className="card-title">{item.company}</h5>
											<img src={item.logo} width={64} alt="Company Logo"></img>
										</div>
									</div>
								</td>
								<td className="col-md-9">
									<div className="card">
										<div className="card-body d-flex d-row justify-content-between" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
											<a onClick={()=>{
												setJob_Id(item.job_id)
												setTitle(item.title)
											}} className="btn btn-primary my-auto btn-lg" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">
												Apply
											</a>
											<h5 className="card-title" style={{width: "15%"}}>{item.title}</h5>
											<h5 className="card-title" style={{width: "15%"}}>{item.job_type}</h5>
											<h5 className="card-title" style={{width: "15%"}}>{item.city}</h5>
											<h5 className="card-title" style={{width: "15%"}}>Experience (years): {item.experience}</h5>
											<h5 className="card-title" style={{width: "15%"}}>Days left: {item.days}</h5>
										</div>
									</div>
								</td>
							</tr>
						)
					})}
					<tr>
						<td colSpan={5} style={{width: "100vw"}}>
							<nav aria-label="...">
								<ul className="pagination justify-content-center">
									<li className="page-item disabled" onClick={() =>setPage(page -1)}>
										<a className="page-link">Previous</a>
									</li>
									<li className={`page-item ${page - 1 === 0 ? 'd-none' : ''}`}><a className="page-link" href="#">{page - 1}</a></li>
									<li className="page-item active" aria-current="page">
										<a className="page-link">{page}</a>
									</li>
									{
										vacancies.length<5?(<></>) : 
										<>
											<li className="page-item"><a className="page-link">{page +1}</a></li>
											<li className="page-item" onClick={() =>setPage(page +1)}>
												<a className="page-link">Next</a>
											</li> 
										</> 
									}
								</ul>
							</nav>
						</td>
					</tr>
				</tbody>
			</table>
			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="exampleModalLabel">Apply to <span className="text-success">{title}</span></h1>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={clearFields}></button>
					</div>
					<div className="modal-body">
						<form>
							{
								picture && (
									<>
										<div className>
											<img src={picture} height={100} alt="Profile Picture"></img>
										</div>
										<button type="button" className="btn-close" onClick={cleanPicture}></button>
									</>
								)
							}
							<div className="mb-3">
								<label htmlFor="recipient-name" className="col-form-label">ID:</label>
								<input value={dni} type="number" placeholder='Submit you ID' className="form-control" id="recipient-name"
								onChange={(e) =>{
									setDni(e.target.value)
								}}/>
							</div>
							<div className="mb-3">
								<label htmlFor="recipient-name" className="col-form-label">Complete name:</label>
								<input value={name} type="text" placeholder='Enter your name' className="form-control" id="recipient-name"
								onChange={(e) =>{
									setName(e.target.value)
								}}/>
							</div>
							<div className="mb-3">
								<label htmlFor="recipient-name" className="col-form-label">Email:</label>
								<input value={email} type="email" placeholder='Submit your email' className="form-control" id="recipient-name"
								onChange={(e) =>{
									setEmail(e.target.value)
								}}/>
							</div>
							<div className="mb-3">
								<label htmlFor="recipient-name" className="col-form-label">Expected Monthly Income:</label>
								<input value={salary} type="number" placeholder='Submit your Expected Income' className="form-control" id="recipient-name"
								onChange={(e) =>{
									setSalary(e.target.value)
								}}/>
							</div>
							<div className="mb-3">
								<label htmlFor="recipient-name" className="col-form-label">Profile Picture:</label>
								<input type="file" placeholder='Choose a profile picture' className="form-control"
								onChange={readPicture}/>
							</div>
						</form>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary" onClick={register}>Send and Apply</button>
						<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					</div>
					</div>
				</div>
			</div>
		</>
	)
  
}

export default PublicVacancies