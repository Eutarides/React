import { useEffect, useState } from "react"
import Form from "./components/Form";
import List from "./components/List";

const App = () => {

	const [student, setStudent] = useState({})
	const [students, setStudents] = useState(JSON.parse(localStorage.getItem('students')) ?? [])

	useEffect(() => {
		localStorage.setItem('students',JSON.stringify(students))
	},[students])

	const deleteStudent = (id)=> {
		if(confirm('¿Desea eliminar este registro?')){
			const newStudents = students.filter(est => est.id !== id)
			setStudents(newStudents)
		}
	}

	return (
		<div className="container content-center">
			<div className="row mt-3">
				<Form student= {student} students = {students} setStudents={setStudents} setStudent={setStudent}></Form>
				<List students= {students} deleteStudent={deleteStudent} setStudent={setStudent}></List>
			</div>
		</div>
	)
}

export default App;