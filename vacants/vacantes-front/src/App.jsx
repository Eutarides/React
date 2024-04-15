import Register from "./components/Register"
import Login from "./components/Login"
import Offers from "./components/Offers"
import MyOffers from "./components/MyOffers"
import { useEffect, useState } from "react"
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'

const App = () => {


	const [user,setUser] = useState(undefined)
	const [page,setPage] = useState(1)
	

	const logOut= ()=> {
		localStorage.clear()
		setUser(undefined)
	}

	useEffect(() =>{
	},[user,page])

	return (
		<BrowserRouter>
			<nav className="py-2 bg-body-tertiary border-bottom">
				<div className="container d-flex flex-wrap">
					<ul className="nav me-auto">
						<li style={{marginRight:"20px"}} className="nav-item">
							<Link to="/" className="d-flex align-items-center mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
								<img src="./../vite.svg" className="bi me-2" width="40" height="32"></img>
								<span className="fs-4">Vacancies</span>
							</Link>
						</li>
						<li className="nav-item"><Link to="/" className="nav-link link-body-emphasis px-2 active" aria-current="page">Home</Link></li>
						<li className="nav-item"><Link to="/" className="nav-link link-body-emphasis px-2">Offers</Link></li>
					</ul>
					<ul className="nav">
						{
							user!==undefined?(
								<>
								<li className="nav-item"><Link to="/MyOffers" className="nav-link link-body-emphasis px-2">Current user: <strong>{user.username} - {user.company.toUpperCase()}</strong></Link></li>
								<li className="nav-item"><Link to="/login" onClick={logOut} className="nav-link link-body-emphasis px-2 text-danger">Logout</Link></li>
								</>
							):(
								<>
								<li className="nav-item"><Link to="/login" className="nav-link link-body-emphasis px-2">Login</Link></li>
								<li className="nav-item"><Link to="/register" className="nav-link link-body-emphasis px-2">Register</Link></li>
								</>
							)
						}
					</ul>
				</div>
			</nav>
			<div id="carouselExample" className="carousel slide" style={{marginBottom:"30px"}}>
				<div className="carousel-inner">
					<div className="carousel-item active">
						<img className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" src="./../slide1.jpg" width="800" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: First slide" preserveAspectRatio="xMidYMid slice"></img>
					</div>
					<div className="carousel-item">
						<img className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" src="./../slide2.jpg" width="800" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Second slide" preserveAspectRatio="xMidYMid slice"></img>
					</div>
					<div className="carousel-item">
						<img className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" src="./../slide3.jpg" width="800" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Third slide" preserveAspectRatio="xMidYMid slice"></img>
					</div>
				</div>
				<button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
					<span className="carousel-control-prev-icon" aria-hidden="true"></span>
					<span className="visually-hidden">Previous</span>
				</button>
				<button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
					<span className="carousel-control-next-icon" aria-hidden="true"></span>
					<span className="visually-hidden">Next</span>
				</button>
			</div>
			<div className="container">
				<Routes>
					<Route path="/" element={<Offers/>}></Route>
					<Route path="/login" element={<Login/>}></Route>
					<Route path="/register" element={<Register/>}></Route>
					<Route path="/MyOffers" element={<MyOffers page={page} setPage={setPage} setUser={setUser}/>}></Route>
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App