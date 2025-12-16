import { useNavigate } from 'react-router';

const SelectRole = () => {
  // this is for navigate 
  const navigate = useNavigate()
  // this is for handle student
  const handleStudent = () => {
    navigate('/studentinformation', {
      state: { role: 'student' }
    })
  }
  // this is for handle tutor
  const handleTutor = () => {
    navigate('/tutorinformation', {
      state: { role: 'tutor' }
    })
  }
  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[500px] text-center">
        <h2 className="text-gray-700 mb-6 font-medium">Please select:</h2>

        <button onClick={handleStudent} className="w-full py-3 rounded-lg mb-4 text-white font-medium 
          bg-gradient-to-r from-[#6657E2] via-[#903CD1] to-[#903CD1]
          hover:opacity-90 transition">
          Student
        </button>
        <button onClick={handleTutor} className="w-full py-3 rounded-lg text-white font-medium 
          bg-gradient-to-r from-[#FFC30B] via-[#8113B5] to-[#8113B5]
          hover:opacity-90 transition">
          Tutor
        </button>
      </div>
    </div>
  );
};

export default SelectRole;