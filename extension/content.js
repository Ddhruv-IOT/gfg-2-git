// (async () => {
//   // Extract problem details
//   const problemTitle = document.querySelector(".g-m-0").innerText;
//   const problemDescription = document.querySelector(".problems_problem_content__Xm_eO").innerText;
//   const questionLink = window.location.href;
//   const problemData = `# ${problemTitle}\n\n${problemDescription}\n\n[Problem Link](${questionLink})`;

//   // Function to create and trigger file downloads
//   const createDownload = (filename, content) => {
//       const blob = new Blob([content], { type: "text/plain" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       a.click();
//       URL.revokeObjectURL(url);
//   };

//   // Function to extract code from Ace Editor
//   function extractCodeFromAceEditor() {
//       const editorContainer = document.querySelector('.ace_layer.ace_text-layer');
//       const editorScrollContainer = document.querySelector('.ace_scrollbar');
//       let codeLines = new Set(); // To avoid duplicates
//       let maxScrollHeight = editorScrollContainer.scrollHeight;
//       let step = 100; // Adjust step for smoother or faster scrolling

//       return new Promise((resolve) => {
//           let currentScroll = 0;

//           function scrollAndCollect() {
//               // Set scroll position
//               editorScrollContainer.scrollTop = currentScroll;

//               // Collect visible lines
//               const visibleLines = editorContainer.querySelectorAll('.ace_line');
//               visibleLines.forEach((line) => {
//                   codeLines.add(line.innerText);
//               });

//               // Check if we've reached the bottom
//               if (currentScroll >= maxScrollHeight) {
//                   resolve([...codeLines].join('\n')); // Return full code as a single string
//                   return;
//               }

//               // Move to the next scroll position
//               currentScroll += step;
//               setTimeout(scrollAndCollect, 100); // Adjust delay as needed
//           }

//           scrollAndCollect();
//       });
//   }

//   // Extract and save the solution code
//   const solutionCode = await extractCodeFromAceEditor();
//   createDownload("README.md", problemData);
//   createDownload("sol.py", solutionCode);
// })();


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
    // SET Based Approach
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

    // Array Based Approach under testing as it may lead to code overlaps while scrolling

    // function extractCodeFromAceEditor() {
    //     const editorContainer = document.querySelector('.ace_layer.ace_text-layer');
    //     const editorScrollContainer = document.querySelector('.ace_scrollbar');
    //     let codeLines = []; // Use an array to keep duplicates
    //     let maxScrollHeight = editorScrollContainer.scrollHeight;
    //     let step = 100; // Adjust step for smoother or faster scrolling
    
    //     return new Promise((resolve) => {
    //         let currentScroll = 0;
    
    //         function scrollAndCollect() {
    //             // Set scroll position
    //             editorScrollContainer.scrollTop = currentScroll;
    
    //             // Collect visible lines
    //             const visibleLines = editorContainer.querySelectorAll('.ace_line');
    //             visibleLines.forEach((line) => {
    //                 codeLines.push(line.innerText);
    //             });
    
    //             // Check if we've reached the bottom
    //             if (currentScroll >= maxScrollHeight) {
    //                 resolve(codeLines.join('\n')); // Return full code as a single string
    //                 return;
    //             }
    
    //             // Move to the next scroll position
    //             currentScroll += step;
    //             setTimeout(scrollAndCollect, 100); // Adjust delay as needed
    //         }
    
    //         scrollAndCollect();
    //     });
    // }
  
    // Get today's date in dd_mm_yy format
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const yy = String(today.getFullYear()).slice(-2);
    const dateSuffix = `${dd}_${mm}_${yy}`;
  
    // Extract and save the solution code
    const solutionCode = await extractCodeFromAceEditor();
    createDownload(`readme_${dateSuffix}.md`, problemData);
    createDownload(`sol_${dateSuffix}.py`, solutionCode);
  
    // Delay for 5 seconds and then make a request to the local server
    setTimeout(() => {
        const url = `http://127.0.0.1:5000/?x=${encodeURIComponent(problemTitle)}`;
        fetch(url)
            .then(response => {
                if (response.ok) {
                    console.log("Request to server successful");
                } else {
                    console.error("Request to server failed", response.status);
                }
            })
            .catch(error => {
                console.error("Error connecting to server", error);
            });
    }, 5000);
  })();
  