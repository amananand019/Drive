(function () {
  let btnAddFolder = document.querySelector("#btnAddFolder");
  let divContainer = document.querySelector("#divContainer");
  let pageTemplates = document.querySelector("#pageTemplates");
  let divBreadCrumb = document.querySelector("#divBreadCrumb");
  let fid = -1;
  let folders = [];
  let cfid = -1; //id of the folder in which we currently are

  btnAddFolder.addEventListener("click", addFolder);

  loadFoldersFromStorage();

  function addFolder() {
    let fname = prompt("Folder name?");
    if (!fname || fname.trim() == "") {
      return;
    }

    let exists = folders
      .filter((f) => f.pid == cfid)
      .some((f) => f.name == fname);
    if (exists) {
      alert("This folder name already exists");
      return;
    }

    fid++;
    addFolderHTML(fname, fid, cfid);

    folders.push({
      id: fid,
      name: fname,
      pid: cfid,
    });
    persistFoldersToStorage();
  }

  function addFolderHTML(fname, fid, pid) {
    let divFolderTemplate = pageTemplates.content.querySelector(".folder");
    let divFolder = document.importNode(divFolderTemplate, true);
    // The Document object's importNode() method creates a copy of a Node
    // or DocumentFragment from another document,
    // to be inserted into the current document later.

    let divName = divFolder.querySelector("[purpose='name']");
    divName.innerHTML = fname;

    divFolder.setAttribute("fid", fid);
    divFolder.setAttribute("pid", pid);
    divContainer.appendChild(divFolder);

    let divDel = divFolder.querySelector("[action='delete']");
    divDel.addEventListener("click", deleteFolder);

    let divEdit = divFolder.querySelector("[action='edit']");
    divEdit.addEventListener("click", editFolder);

    let divView = divFolder.querySelector("[action='view']");
    divView.addEventListener("click", viewFolder);
  }

  function viewFolder() {
    let divFolder = this.parentNode;
    let divName = divFolder.querySelector("[purpose='name']");
    cfid = parseInt(divFolder.getAttribute("fid"));

    let aPathTemplate = pageTemplates.content.querySelector(".path");
    let aPath = document.importNode(aPathTemplate, true);

    aPath.innerHTML = divName.innerHTML;
    divBreadCrumb.appendChild(aPath);

    divContainer.innerHTML = "";
    folders
      .filter((f) => f.pid == cfid)
      .forEach((f) => {
        addFolderHTML(f.name, f.id, f.pid);
      });
  }

  function editFolder() {
    let divFolder = this.parentNode;
    let divName = divFolder.querySelector("[purpose='name']");
    let oname = divName.innerHTML;

    let nname = prompt("New folder name for " + divName.innerHTML);
    if (!!nname) {
      if (nname != oname) {
        let exists = folders
          .filter((f) => f.pid == cfid)
          .some((f) => f.name == nname);
        if (exists == false) {
          divName.innerHTML = nname;
          let folder = folders
            .filter((f) => f.pid == cfid)
            .find((f) => f.id == parseInt(divFolder.getAttribute("fid")));
          folder.name = nname;
          persistFoldersToStorage();
        } else {
          alert("This folder name already exists");
        }
      } else {
        alert("Please enter a new name");
      }
    } else {
      alert("Please enter a name");
    }
  }

  function deleteFolder() {
    let divFolder = this.parentNode;
    let divName = divFolder.querySelector("[purpose='name']");

    let flag = confirm("Do you want to delete " + divName.innerHTML + "?");
    if (flag) divContainer.removeChild(divFolder);

    let idx = folders
      .filter((f) => f.pid == cfid)
      .findIndex((f) => f.id == parseInt(divFolder.getAttribute("fid")));
    folders.splice(idx, 1);
    persistFoldersToStorage();
  }

  function persistFoldersToStorage() {
    console.log(folders);
    let fjson = JSON.stringify(folders);
    localStorage.setItem("data", fjson);
  }

  function loadFoldersFromStorage() {
    let fjson = localStorage.getItem("data");
    if (!!fjson) {
      folders = JSON.parse(fjson);
      let max = -1;
      folders.forEach(function (f) {
        if (f.pid == cfid) addFolderHTML(f.name, f.id);
        if (f.id > max) max = f.id;
      });
      fid = max;
    }
  }
})();
