import React, { useEffect, useState } from 'react';
import Split from 'react-split';  
import EnvInputFields from '../components/EnvInputFields';
import OutputConsole from '../components/OutputConsole';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { NotionRenderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

export interface Project {
  id: string;
  username: string;
  testFileUrl: string;
  thumbnailUrl: string;
  notionLink: string;
  title: string;
  envs: string[];
  createdAt: string;
}

const ProjectDetailPage: React.FC = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [recordMap, setRecordMap] = useState<any | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [output, setOutput] = useState<string>('No output yet...');
  const [envs, setEnvs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tests/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch project details');
        const data = await response.json();
        setProject(data);

        const envsObj = data.envs.reduce((acc: { [key: string]: string }, env: string) => {
          acc[env] = '';
          return acc;
        }, {});
        setEnvs(envsObj);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchNotionPage = async () => {
      if (!project?.notionLink) return;

      const notionId = project.notionLink.split('-').pop();
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notion-page/${notionId}`);
        // const response = await fetch("http://localhost:3000/notion-page/1288b46161dc801ebb18d463133c4bb9")
        if (!response.ok) throw new Error('Failed to fetch Notion page');
        const data = await response.json();
        setRecordMap(data);
      } catch (error) {
        console.error('Failed to fetch Notion page:', error);
      }
    };

    fetchNotionPage();
  }, [project?.notionLink]);

  const handleRunTest = async () => {
    if (!project) return;
    setOutput('Running test...');

    const payload = {
      username: project.username,
      testId: project.id,
      envs,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/test/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      setOutput(response.ok ? JSON.stringify(result) : `Error: ${result.error || 'Failed to submit test'}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      setOutput('Error submitting test');
    }
  };

  return (
    <div className='h-screen overflow-y-hidden'>
      <div className='w-full h-[7%] flex items-center justify-center'>
        <button
          className='font-semibold bg-slate-500 px-4 py-1 bg-opacity-40 text-white rounded-lg gap-1 left-[4%] absolute flex items-center'
          onClick={() => navigate("/")}
        >
          <IoIosArrowBack className='bg-opacity-0 bg-transparent text-white' />
          BACK
        </button>
        <button
          className='font-semibold bg-blue-500 px-12 py-2 bg-opacity-70 text-white rounded-lg flex gap-2 items-center'
          onClick={handleRunTest}
        >
          <FaPlay className='bg-transparent text-white' />
          RUN
        </button>
      </div>
      <div className="h-[91%] border w-full flex">
        <Split
          className="flex-1 flex"
          sizes={[50, 50]}  
          minSize={100}  
          gutterSize={15}  
          gutterAlign="center" 
          snapOffset={30} 
          expandToMin={false}
          dragInterval={1}
          cursor="col-resize"
        >
          <div className="p-4 overflow-y-auto border-r h-full">
            {recordMap ? (
              <div className="w-full h-full overflow-auto">
                <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
              </div>
            ) : (
              <p>Loading Notion content...</p>
            )}
          </div>

          <div className="flex-1 flex flex-col h-full">
            <Split
              direction='vertical'
              className="flex-1 flex flex-col"
              sizes={[50, 50]}  
              minSize={150}  
              gutterSize={15}  
              gutterAlign="center"
              snapOffset={30}  
            >
              <div className="p-4 border-b h-full">
                {project && <EnvInputFields envs={envs} setEnvs={setEnvs} />}
              </div>

              <div className="p-4 h-full">
                <OutputConsole output={output} />
              </div>
            </Split>
          </div>
        </Split>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
