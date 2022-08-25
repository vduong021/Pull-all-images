// // chrome.tabs.query(queryObject,callback);
// //assign variable to id grabBtn
// const grabBtn = document.getElementById("grabBtn");
// //create event for when button is clicked
// grabBtn.addEventListener("click", () => {
//   //detect if a tab in the chrome browser is opened, if so invoke function
//   chrome.tabs.query({active: true}, (tabs) => {
//     //assign a variable to the first tab
//     let tab = tabs[0];
//     //if a tab is present, alert of tab id
//     if (tab) {
//       //execute script to grab all function
//       chrome.scripting.executeScript(
//         {
//           target:{tabId: tab.id, allFrames: true},
//           func:grabImages
//         },
//         onResult
//       )
//     } else {
//       alert("There are no active tabs")
//     }
//   })
// })

// function grabImages() {
//   // TODO - Query all images on a target web page
//   const img = documents.querySelectorAll("img");
//   // and return an array of their URLs
//   return Array.from(img).map(image => image.src)
// }

// function onResult(frames) {
//   // If script execution failed on the remote end 
//     // and could not return results
//     if (!frames || !frames.length) { 
//       alert("Could not retrieve images from specified page");
//       return;
//   }
//   //combine arrays of the image URLS from each frame to a single array
//   const imageURLs = frames.map(frame => frame.result).reduce((r1, r2) => r1.concat(r2));
//   //copy to clipboard a string of image URLs, delimited by carriage return symbol
//   window.navigator.clipboard
//     .writeText(imageURLs.join("\n"))
//     .then(() =>{
//       //close the extension popup after data is copied to clipboard
//       window.close();
//     });
// } 

const grabBtn = document.getElementById("grabBtn");
grabBtn.addEventListener("click",() => {    
    // Get active browser tab
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        if (tab) {
            execScript(tab);
        } else {
            alert("There are no active tabs")
        }
    })
})

/**
 * Execute a grabImages() function on a web page,
 * opened on specified tab and on all frames of this page
 * @param tab - A tab to execute script on
 */
function execScript(tab) {
    // Execute a function on a page of the current browser tab
    // and process the result of execution
    chrome.scripting.executeScript(
        {
            target:{tabId: tab.id, allFrames: true},
            func:grabImages
        },
        onResult
    )
}

/**
 * Executed on a remote browser page to grab all images
 * and return their URLs
 * 
 *  @return Array of image URLs
 */
function grabImages() {
    const images = document.querySelectorAll("img");
    return Array.from(images).map(image=>image.src);    
}

/**
 * Executed after all grabImages() calls finished on 
 * remote page
 * Combines results and copy a list of image URLs 
 * to clipboard
 * 
 * @param {[]InjectionResult} frames Array 
 * of grabImage() function execution results
 */
function onResult(frames) {
    // If script execution failed on remote end 
    // and could not return results
    if (!frames || !frames.length) { 
        alert("Could not retrieve images from specified page");
        return;
    }
    // Combine arrays of image URLs from 
    // each frame to a single array
    const rawImageUrls = frames.map(frame=>frame.result)
                            .reduce((r1,r2)=>
                              r1.concat(r2)
                            )
    // Copy to clipboard a string of image URLs, delimited by 
    // const imageUrls = [];
    // for (let i = 0; i < rawImageUrls.length; i++) {
    //   imageUrls.push(`${i+1}: ${rawImageUrls[i]}`)
    // }
    // alert(imageUrls[2])
    
    // carriage return symbol  
    window.navigator.clipboard
          .writeText(rawImageUrls.join("\n \n "))
          .then(()=>{
             // close the extension popup after data 
             // is copied to the clipboard
             window.close();
          });
  // console.log(imageUrls)        
}
1 