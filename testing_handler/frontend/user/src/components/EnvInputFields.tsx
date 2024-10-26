import React from 'react';

interface EnvInputFieldsProps {
  envs: { [key: string]: string };  
  setEnvs: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>; 
}

const EnvInputFields: React.FC<EnvInputFieldsProps> = ({ envs, setEnvs }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnvs((prev) => ({ ...prev, [name]: value })); 
  };

  return (
    <div className='flex flex-col items-center h-full gap-3 py-10'>
      <h2 className="text-3xl font-bold h-[18%]">Environment Variables</h2>
      <form className="mt-4 space-y-2 w-[80%] overflow-y-scroll no-scrollbar flex flex-col">
        {Object.keys(envs).map((key) => ( 
          <div className='flex gap-5 w-[70%]' key={key}>
            <label className="text-sm flex items-center w-[30%]">{key}:</label>
            <input
              type="text"
              name={key} 
              value={envs[key] || ''} 
              onChange={handleInputChange} 
              className="border border-slate-100 focus:outline-none border-opacity-25 p-2 w-[70%]"
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default EnvInputFields;
