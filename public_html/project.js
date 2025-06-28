var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var projDBName = "COLLEGE-DB";
var projRelName = "PROJECT-TABLE";
var connToken = "90935035|-31949209578296372|90958922"; 

function saveRecNoToLS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getProjIdAsJsonObj() {
    var projid = $("#projid").val();
    var jsonStr = {
        id: projid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNoToLS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#projname").val(data.projname);
    $("#assigned").val(data.assigned);
    $("#assigndate").val(data.assigndate);
    $("#deadline").val(data.deadline);
}

function resetForm() {
    $("#projid").val("").prop("disabled", false);
    $("#projname").val("").prop("disabled", true);
    $("#assigned").val("").prop("disabled", true);
    $("#assigndate").val("").prop("disabled", true);
    $("#deadline").val("").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#projid").focus();
}

function validateData() {
    var projid = $("#projid").val();
    var projname = $("#projname").val();
    var assigned = $("#assigned").val();
    var assigndate = $("#assigndate").val();
    var deadline = $("#deadline").val();

    if (!projid || !projname || !assigned || !assigndate || !deadline) {
        alert("Please fill all fields!");
        return "";
    }

    var jsonStr = {
        id: projid,
        projname: projname,
        assigned: assigned,
        assigndate: assigndate,
        deadline: deadline
    };
    return JSON.stringify(jsonStr);
}

function getProject() {
    alert("✅ getProject triggered");

    var projIdJson = getProjIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projDBName, projRelName, projIdJson);
    
    console.log("GET request:", getRequest);

    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    console.log("Response:", res);  // ← SHOW THE RESPONSE!

    if (!res) {
        alert("❌ No response from server.");
        return;
    }

    if (res.status === 400) {
        alert("🆕 New ID. You can enter data now.");
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#projname, #assigned, #assigndate, #deadline").prop("disabled", false);
        $("#projname").focus();
    } else if (res.status === 200) {
        alert("📦 Existing ID. Data loaded.");
        fillData(res);
        $("#projid").prop("disabled", true);
        $("#update, #reset").prop("disabled", false);
        $("#projname, #assigned, #assigndate, #deadline").prop("disabled", false);
        $("#projname").focus();
    } else {
        alert("⚠️ Unexpected API status: " + res.status);
    }
}

function saveData() {
    var jsonStr = validateData();
    if (!jsonStr) return;

    var putReqStr = createPUTRequest(connToken, jsonStr, projDBName, projRelName);
    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

function updateData() {
    $("#update").prop("disabled", true);
    var jsonStr = validateData();
    if (!jsonStr) return;

    var updateRequest = createUPDATERecordRequest(connToken, jsonStr, projDBName, projRelName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
}





