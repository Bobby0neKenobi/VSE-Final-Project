import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

export default function StartingScreen(){
    const navigate = useNavigate();
    return (
        <div className="flex-col text-center bg-white pb-[5rem]">
            <Header/>
            <h1 className="text-[8rem] m-[0px] pt-[5px] text-transparent bg-clip-text bg-gradient-to-r from-[#0F0] to-[#00F]">Schematrix</h1>
            <p className="text-[4rem] mx-[5rem] mb-[1rem]">Welcome to Schematrix</p>
            <p className="text-[2.3rem] mx-[5rem] my-[1rem]">Your ultimate tool for designing and simulating electronic schematics with ease.</p>
            <p className="text-[2.3rem] mx-[5rem] pt-[2rem] my-[0px]">Create, edit, and visualize complex circuits with intuitive drag-and-drop features.</p>
            <p className="text-[2.3rem] mx-[5rem] pt-[1rem] my-[0px]">Whether you're a hobbyist, student, or professional engineer, Schematrix empowers you to bring your ideas to life.</p>
            <p className="text-[2.3rem] mx-[5rem] pt-[1rem] my-[0px]">Start building today and turn your concepts into reality!</p>
            <div style={{display: 'flex', gap: '3rem', justifyContent: 'center'}}>
                <button type="button" className="mt-[2rem] bg-[#257DD6] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#0F0]" onClick={() => navigate('/signup')}>Start Now</button>
            </div>
        </div>
    );
}