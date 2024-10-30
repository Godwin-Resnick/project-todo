import React from 'react';
import axios from 'axios';

const GistExport = ({ project }) => {
  const exportGist = async () => {
    try {
      // Make a request to export the gist
      const response = await axios.get(`http://localhost:5000/api/projects/${project._id}/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Check if the response contains the markdown content
      if (response.data && response.data.gistUrl) {
        // Create a blob with the markdown content for download
        const blob = new Blob([response.data.gistUrl], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title}-summary.md`;  // Ensure correct filename
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('No gist URL found in the response');
      }
    } catch (error) {
      console.error('Error exporting gist:', error);
    }
  };

  return (
    <button style={{ display: 'block', margin: '0 auto' }} onClick={exportGist}>
      Export Project as Gist
    </button>
  );
};

export default GistExport;
