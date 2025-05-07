import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const navigate = useNavigate()
  return (
    <form
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        const user = e.target.elements.user.value;
        const password = e.target.elements.password.value;
        console.log(user, password);
        navigate('/');
      }}
    >
      <div className="border-[5px] w-[70vh] h-fit rounded-[1rem] text-center">
        <h1 className="h-[4rem] text-transparent bg-clip-text bg-gradient-to-r from-[#0F0] to-[#00F]">
          Sign up
        </h1>
        <label
          htmlFor="user"
          className="text-[1.25rem] text-transparent bg-clip-text bg-gradient-to-r from-[#0F0] to-[#00F]"
        >
          Username:
        </label>
        <br />
        <input type="text" id="user" className="mb-[3rem]" />
        <br />
        <label
          htmlFor="password"
          className="text-[1.25rem] text-transparent bg-clip-text bg-gradient-to-r from-[#0F0] to-[#00F]"
        >
          Password:
        </label>
        <br />
        <input type="password" id="password" />
        <br />
        <button
          className="mt-[3rem] bg-[#257DD6] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#0F0] mb-[3rem]"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
