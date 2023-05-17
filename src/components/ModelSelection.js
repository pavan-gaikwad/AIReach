import React, { useState } from 'react';

const ModelSelection = ({ models , setModel, setMaxTokens, maxTokens}) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModelDetails, setshowModelDetails] = useState(null);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setModel(model)
    console.log("selected model ", model)
    setshowModelDetails(true)
  };

  const toggleModelPanel = () => {
    setshowModelDetails(!showModelDetails);
  }

  return (
    <div className='flex flex-col' >
      {/* <h2>Model Selection</h2> */}
      <div className='flex gap-2'>
      <div>
      <select onChange={(e) => handleModelSelect(e.target.value)}>
        <option value="">Select a model</option>
        {models.map((model, index) => (
          <option key={index} value={model['LATEST MODEL']}>
            {model['LATEST MODEL']}
          </option>
        ))}
      </select>
      </div>
      
      <div>
      {
        showModelDetails? <button type="button" className="bg-red-400 text-white rounded p-2 text-xs" onClick={toggleModelPanel}>Close Details</button> :
        <button type="button" className="bg-blue-400 text-white rounded p-2 text-xs" onClick={toggleModelPanel}>Show Details</button>
      }
      </div>
      <div>
      <input onChange={(e)=>setMaxTokens(e.target.value)} value={maxTokens} placeholder='Enter Max Tokens'></input>
      </div>
      </div>
      
      <div>
      {selectedModel && showModelDetails && (
        <div className='bg-slate-300 p-2 border'>
          <h3>Selected Model: {selectedModel}</h3>
          <p>
            <strong>Description:</strong> {models.find((model) => model['LATEST MODEL'] === selectedModel)['DESCRIPTION']}
          </p>
          <p>
            <strong>Max Tokens:</strong> {models.find((model) => model['LATEST MODEL'] === selectedModel)['MAX TOKENS']}
          </p>
          <p>
            <strong>Training Data:</strong> {models.find((model) => model['LATEST MODEL'] === selectedModel)['TRAINING DATA']}
          </p>
        </div>
      )}
    </div>
    </div>
  );
};

export default ModelSelection;
