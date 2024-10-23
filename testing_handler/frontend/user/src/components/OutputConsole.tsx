import React from 'react';

interface OutputConsoleProps {
  output: string;
}

const OutputConsole: React.FC<OutputConsoleProps> = ({ output }) => {

  const formattedOutput = () => {
    if (output === 'No output yet...' || output === 'Running test...') {
      return output;
    }
    
    try {
      const jsonOutput = JSON.parse(output);
      return JSON.stringify(jsonOutput, null, 2); 
    } catch {
      return output; 
    }
  }

  return (
    <div className="bg-black text-white p-4 h-[90%]">
      <h2 className="text-xl font-bold">Test Output</h2>
      <div className="mt-4 p-2 bg-gray-800 h-full overflow-scroll no-scrollbar">
        <pre className='bg-gray-800'>{formattedOutput()}</pre>
      </div>
    </div>
  );
};

export default OutputConsole;
