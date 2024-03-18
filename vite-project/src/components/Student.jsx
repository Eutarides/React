import PropTypes from 'prop-types';
const Student = ({student, deleteStudent, setStudent}) => {

	const {id,document,name,surname,email,phone} = student

	return (
		<tr>
			<th scope="row">{document}</th>
			<td>{name}</td>
			<td>{surname}</td>
			<td>{email}</td>
			<td>{phone}</td>
			<td>
				<button className="btn btn-info" onClick={() => setStudent(student)}>Editar</button>
				<button className="btn btn-danger" onClick={() => deleteStudent(id)}>Eliminar</button>
			</td>
		</tr>
	)
}

Student.propTypes = {
	student: PropTypes.object.isRequired,
	deleteStudent: PropTypes.func.isRequired,
	setStudent: PropTypes.func.isRequired
};

export default Student