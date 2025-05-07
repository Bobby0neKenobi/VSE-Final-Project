import { useNavigate } from "react-router-dom"

export default function Header(){
    const navigate = useNavigate();
    return(<header style={{height: '5rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '2%', paddingRight: '2%'}} className="bg-gradient-to-r from-[#0F0] to-[#00F]">
        <div>
            <img src="./logo.png" style={{height: '3.5rem'}}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <button type="button" className="bg-[#257DD6] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#0F0]" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <img src='./profileImage.jpg' style={{borderRadius: '100%', height: '3rem', marginLeft: '2rem'}} className="hover:opacity-[90%]"/>
        </div>
    </header>)
}