// (async () => {
//     // const problemTitle = document.querySelector("h1").innerText; // Update selector if needed
//     // const problemDescription = document.querySelector(".problem-description").innerText; // Update selector
//     // const questionLink = window.location.href;
  
//     // // Assuming your solution is in a specific editor or text area
//     // const solutionCode = document.querySelector(".code-editor").innerText; // Update selector
  
//     // // Send the data back to the background or use it directly for file creation
//     // const problemData = `# ${problemTitle}\n\n${problemDescription}\n\n[Problem Link](${questionLink})`;
//     // const solutionFile = solutionCode;

//     const problemTitle = document.querySelector(".g-m-0").innerText;

//   // Extract the problem statement from div with class 'problems_problem_content__Xm_eO'
//   const problemDescription = document.querySelector(".problems_problem_content__Xm_eO").innerText;

//   // Get the current question link (URL of the page)
//   const questionLink = window.location.href;
//   const problemData = `# ${problemTitle}\n\n${problemDescription}\n\n[Problem Link](${questionLink})`;

//     // Trigger downloads
//     const createDownload = (filename, content) => {
//       const blob = new Blob([content], { type: "text/plain" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       a.click();
//       URL.revokeObjectURL(url);
//     };
  
//     createDownload("README.md", problemData);
//     createDownload("sol.py", "TD");
//   })();
  

(async () => {
  // Extract problem details
  const problemTitle = document.querySelector(".g-m-0").innerText;
  const problemDescription = document.querySelector(".problems_problem_content__Xm_eO").innerText;
  const questionLink = window.location.href;
  const problemData = `# ${problemTitle}\n\n${problemDescription}\n\n[Problem Link](${questionLink})`;

  // Function to create and trigger file downloads
  const createDownload = (filename, content) => {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
  };

  // Function to extract code from Ace Editor
  function extractCodeFromAceEditor() {
      const editorContainer = document.querySelector('.ace_layer.ace_text-layer');
      const editorScrollContainer = document.querySelector('.ace_scrollbar');
      let codeLines = new Set(); // To avoid duplicates
      let maxScrollHeight = editorScrollContainer.scrollHeight;
      let step = 100; // Adjust step for smoother or faster scrolling

      return new Promise((resolve) => {
          let currentScroll = 0;

          function scrollAndCollect() {
              // Set scroll position
              editorScrollContainer.scrollTop = currentScroll;

              // Collect visible lines
              const visibleLines = editorContainer.querySelectorAll('.ace_line');
              visibleLines.forEach((line) => {
                  codeLines.add(line.innerText);
              });

              // Check if we've reached the bottom
              if (currentScroll >= maxScrollHeight) {
                  resolve([...codeLines].join('\n')); // Return full code as a single string
                  return;
              }

              // Move to the next scroll position
              currentScroll += step;
              setTimeout(scrollAndCollect, 100); // Adjust delay as needed
          }

          scrollAndCollect();
      });
  }

  // Extract and save the solution code
  const solutionCode = await extractCodeFromAceEditor();
  createDownload("README.md", problemData);
  createDownload("sol.py", solutionCode);
})();
