import md5 from 'md5'
import {useCallback, useEffect, useState} from "react"
import {Navigate} from 'react-router-dom'
import PropTypes from 'prop-types';
import Error from "./common/Error"
import Title from "./common/Title"
import Swal from 'sweetalert2'
import axios from 'axios'
import VacantList from './VacantList';
import ApplicationList from './ApplicationList';

const MyOffers = ({setUser, page, setPage}) => {
	const [name,setName] = useState('')
	const [goLogin,setGoLogin] = useState(false)
	const[loading,setLoading]= useState(false)
	const[error,setError]= useState(false)
	const[title,setTitle]= useState('')
	const[city,setCity]= useState('')
	const[experience,setExperience]= useState(1)
	const[job_type,setJobType]= useState('')
	const[from_date,setFromDate]= useState('')
	const[until_date,setUntilDate]= useState('')
	const[company_id,setCompanyId]= useState('')
	const jobTypeList = ['Remote', 'In Person', 'Semi-remote']
	const[job_id,setJob_Id] = useState('')

	const [vacancies,setVacancies] = useState([])
	const [applications,setApplications] = useState([])
	const [vacant,setVacant] = useState()
	const [deleteVacant, setDeleteVacant] = useState()
	const [selectedJob, setSelectedJob] = useState()


	const sessionValidate = useCallback (async () => {
		try {
			const {email,username,id,company} = await JSON.parse(localStorage.getItem('user'))
			const sessionId = localStorage.getItem('sessionId')
			setUser(JSON.parse(localStorage.getItem('user')))
			setName(company)
			setCompanyId(id)
			if (sessionId!==md5(id+email+username)){
				localStorage.clear()
				setGoLogin(true)
				return
			}
		}catch(err){
			setGoLogin(true)
			localStorage.clear()
			return
		}
	},[setUser]
	)

	const getVacanciesApi = useCallback(
		async () => {
			sessionValidate();
	
			try {
					const { data } = await axios.get(`job/all/${company_id}/${page}/5`);
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
		},[company_id,sessionValidate, page]
	)

	const getApplicationsApi = useCallback(
		async () => {
	
			try {
					const { data } = await axios.get(`applications/${selectedJob}`);
					if(data.length>0){
						setApplications(data);
					}
			} catch (err) {
				setApplications([])
				if (!err.message.includes('400')){
					Swal.fire({
						position: 'top-end',
						icon: 'warning',
						title: err.message.includes('400') ? 'No Applications available' : err.message,
						showConfirmButton: false,
						timer: 2000
					})
				}
			}
			setLoading(false);
		},[selectedJob]
	)

	const loadData = useCallback(
		async () => {
			try {
				const {email,username,id,company} = await JSON.parse(localStorage.getItem('user'))
				const sessionId = localStorage.getItem('sessionId')
				setUser(JSON.parse(localStorage.getItem('user')))
				setName(company)
				setCompanyId(id)
				if (sessionId!==md5(id+email+username)){
					localStorage.clear()
					setGoLogin(true)
				}
			}catch(err){
				setGoLogin(true)
				localStorage.clear()
			}
		},[setUser]
	)

	const clearFields = (e) => {
		if (e) {
			e.preventDefault();}
		setTitle('')
		setCity('')
		setExperience(1)
		setJobType('')
		setFromDate('')
		setUntilDate('')
		setJob_Id('')
		setVacant()

	}

	const register = async (e) => {
		e.preventDefault()
		sessionValidate()
		let obj = {title,city,experience,from_date,until_date,company_id,job_type}
		if([title,city,experience,from_date,until_date,company_id,job_type].includes('')){
			Swal.fire({
				position: 'center',
				icon:'warning',
				title: "All fields must be filled",
				showConfirmButton: false,
				timer: 2000
			})
			return
		}else if(!jobTypeList.includes(job_type)){
			Swal.fire({
				position: 'center',
				icon:'warning',
				title: "Choose a Job Type",
				showConfirmButton: false,
				timer: 2000
			})
			return
		}else{
			setLoading(true)
			let data
			try{
				if(vacant!==undefined){
					data = await axios.put(`job/${vacant.job_id}`, obj)
				}else{
					data = await axios.post('job',obj,)
				}
				Swal.fire({
					position: 'top-end',
					icon:'success',
					html: `<strong>${data.data.message}</strong>`,
					showConfirmButton: false,
					timer: 2000
				})
			}catch(err){
				Swal.fire({
					position: 'top-end',
					icon:'error',
					title: err.message.includes('401')?'Incorrect login data': err.message,
					showConfirmButton: false,
					timer: 2000
				})
			}
			setLoading(false)
			clearFields()
			getVacanciesApi()
		}

	}

	const deleteVacants = useCallback(
		async () => {
	
			Swal.fire({
				title: "Are you sure?",
				text: "You won't be able to revert this!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, delete it!"
			}).then(async (result) => {
				if (result.isConfirmed) {
					try {
	
						const {id} = await JSON.parse(localStorage.getItem('user'))
						let obj = await { company_id : id };
						const { data } = await axios.delete(`job/${deleteVacant}`, { data: obj });
						Swal.fire({
							title: "Deleted!",
							text: data.message,
							icon: "success"
						});
					} catch (e) {
						Swal.fire({
							title: "Error!",
							text: e.message,
							icon: "error"
						});
					}
					setDeleteVacant();
				} else {
					setDeleteVacant();
				}
			});
		},
		[deleteVacant]
	);

	useEffect(() =>{
		loadData()
		getVacanciesApi()
	},[loadData, getVacanciesApi, company_id, page, vacancies])

	useEffect(() =>{
		if(vacant){
			setTitle(vacant.title)
			setCity(vacant.city)
			setExperience(vacant.experience)
			setJobType(vacant.job_type)
			if (vacant.from_date && vacant.until_date) {
				setFromDate(new Date(vacant.from_date).toISOString().split('T')[0]);
				setUntilDate(new Date(vacant.until_date).toISOString().split('T')[0]);
			}
			setJob_Id(vacant.job_id)
		}
	}, [vacant])

	useEffect(() => {
		if(deleteVacant>0){
			deleteVacants()
		}
		getVacanciesApi()
	},[deleteVacant, deleteVacants,getVacanciesApi])

	useEffect(()=>{
		if(selectedJob>0){
			getApplicationsApi()
		}
	},[selectedJob,getApplicationsApi])

	if(goLogin){
		return<Navigate to="/login"/>
	}

	return (
		<>
			<form onSubmit={register}>
				<div className="container mb-5">
					<div className="row">
						<div className="col-md-4 card">
							<Title title="Vacancies Management"></Title>
							<div className="card-body">
								<div className="card-title text-center border-bottom">
									<h5>Insert Data</h5>
								</div>
								<div className="mb-3">
									<label className="form-label">Vacant title</label>
									<input type="text" value={title} placeholder='ex: React dev' className="form-control" aria-describedby="Vacant Title" onChange={(e) => setTitle(e.target.value)}/>
								</div>
								<div className="mb-3">
									<label className="form-label">City</label>
									<input type="text" value={city} placeholder='ex: Campica' className="form-control" aria-describedby="City" onChange={(e) => setCity(e.target.value)}/>
								</div>
								<div className="mb-3">
									<label className="form-label">Experience (years)</label>
									<input type="Number" value={experience} min={1} className="form-control" aria-describedby="Experience" onChange={(e) => setExperience(e.target.value)}/>
								</div>
								<div className="mb-3">
									<label className="form-label">Type</label>
									<select className="form-select" value={job_type} aria-describedby="Job Type" onChange={(e) => setJobType(e.target.value)}>
										<option value=''>Job Type</option>
										{
											jobTypeList.map((item,index)=>{
												return <option key={index} value={item}>{item}</option>
											})
										}
									</select>
								</div>
								<div className="mb-3">
									<label className="form-label">Publish from:</label>
									<input type="date" value={from_date} min={new Date().toISOString().slice(0,10)} className="form-control" aria-describedby="Publish from:" onChange={(e) => setFromDate(e.target.value)}/>
								</div>
								<div className="mb-3">
									<label className="form-label">Active Until:</label>
									<input type="date" value={until_date} min={new Date().toISOString().slice(0,10)} className="form-control" aria-describedby="Publish from:" onChange={(e) => setUntilDate(e.target.value)}/>
								</div>
								{error && <Error message='Every field is mandatory'></Error>}
								<div className="d-grid">
									{
										loading ?
										(	
											<>
											<div className="spinner-border text-success mx-auto" role="status">
												<span className="visually-hidden">Loading...</span>
											</div>
											</>
										)
										:
										(
											<>
											{
												vacant?<button type="submit" className="btn btn-success">Update</button> : <button type="submit" className="btn btn-success">Publish</button>
											}
											</>
										)
									}
									<input onClick={(e) => clearFields(e)} value='Cancelar' type="button" className="btn btn-info my-2"/>
								</div>
							</div>
						</div>
						<div className="col-md-8">
							<Title title="Vacancies List"></Title>
							<div className="card border mb-3">
								<div className="card-body">
									<h5 className="card-title text-center">Insert data</h5>
									<VacantList page={page} setPage={setPage} vacancies={vacancies} vacant={vacant} setVacant={setVacant} setDeleteVacant={setDeleteVacant} setSelectedJob={setSelectedJob}></VacantList>
								</div>
							</div>
							<Title title="Applications List"></Title>
							<div className="card border mb-3">
								<div className="card-body">
									<h5 className="card-title text-center">Insert data</h5>
									<ApplicationList page={page} setPage={setPage} applications={applications} ></ApplicationList>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</>
	)
}

MyOffers.propTypes = {
	setUser: PropTypes.func.isRequired,
	setPage: PropTypes.func.isRequired,
	page: PropTypes.number
}


export default MyOffers