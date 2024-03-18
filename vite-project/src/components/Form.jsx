import PropTypes from 'prop-types';
import { useState, useEffect } from "react"
import Error from "./Error"

const Form = ({setStudents, students, student, setStudent}) => {

	const [ document, setDocument ] = useState('')
	const [ name, setName ] = useState('')
	const [ surname, setSurname ] = useState('')
	const [ phone, setPhone ] = useState('')
	const [ email, setEmail ] = useState('')
	const [ error, setError ] = useState(false)

	const sendForm = (e) => {
		e.preventDefault()

		if([document,name,surname,email,phone].includes('')){
			setError(true)
			return
		}else setError(false)

		const obj ={
			document,
			name,
			surname,
			phone,
			email
		}

		if(student.id){
			obj.id = student.id
			const otherStudents = students.map(est => est.id === student.id ? obj:est)
			setStudents(otherStudents)
		}else{
			obj.id = getId()
			setStudents([...students,obj])
		}

		cleanFields()
	}

	const cleanFields = () => {
		setDocument('')
		setName('')
		setSurname('')
		setPhone('')
		setEmail('')
		setError(false)
		setStudent({})
	}

	const getId = () => {
		let id = (Math.random().toString(2)+Date.now().toString(36))
		return id
	}

	useEffect(()=> {
		if(student.id && student.id !== ''){
			setDocument(student.document)
			setName(student.name)
			setSurname(student.surname)
			setPhone(student.phone)
			setEmail(student.email)
		}
	},[student])

	return (
		<div className="col-md-5">
		<form onSubmit={sendForm}>
			<div className="card">
				<div className="card-header">Formulario</div>
				{ error && <Error message='Todos los campos son obligatorios'></Error> }
				<div className="card-body">
						<div className="mb-3">
							<label className="form-label">Documento</label>
							<input type="number" className="form-control" id="exampleInputEmail1"value={document}
							onChange={(e) => setDocument(e.target.value)}/>
						</div>
						<div className="mb-3">
							<label className="form-label">Nombre</label>
							<input type="text" className="form-control" id="exampleInputEmail1" value={name}
							onChange={(e) => setName(e.target.value)}/>
						</div>
						<div className="mb-3">
							<label className="form-label">Apellidos</label>
							<input type="text" className="form-control" id="exampleInputEmail1" value={surname}
							onChange={(e) => setSurname(e.target.value)}/>
						</div>
						<div className="mb-3">
							<label className="form-label">Teléfono</label>
							<input type="number" className="form-control" id="exampleInputEmail1" value={phone}
							onChange={(e) => setPhone(e.target.value)}/>
						</div>
						<div className="mb-3">
							<label className="form-label">Email</label>
							<input type="text" className="form-control" id="exampleInputEmail1" value={email}
							onChange={(e) => setEmail(e.target.value)}/>
						</div>
						<div className="d-grid">
							<button type="submit" className="btn btn-success">
								{student.id?'Editar':'Registrar'}
							</button>
							<input onClick={cleanFields} value='Cancelar' type="button" className="btn btn-info my-2"/>
						</div>
				</div>
			</div>
		</form>
		</div>
	)
}

Form.propTypes = {
    students: PropTypes.array.isRequired,
	setStudents: PropTypes.func.isRequired,
	student: PropTypes.object.isRequired,
	setStudent: PropTypes.func
};


export default Form