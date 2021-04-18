setTimeout(function() {
    $(document).ready(function() {
        new Chart(document.getElementById("chart1"), { "type": "line", "data": { "labels": ["January", "February", "March", "April", "May", "June", "July"], "datasets": [{ "label": "Usage Analysis", "data": [1065, 1059, 1080, 1081, 1056, 1055, 1040], "fill": false, "borderColor": "rgb(99, 203, 137)", "lineTension": 0.1 }] }, "options": {} });
    });
}, 3000);
setTimeout(function() {
    $(document).ready(function() {
        new Chart(document.getElementById("chart2"), { "type": "line", "data": { "labels": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], "datasets": [{ "label": "Usage Analysis", "data": [152, 163, 160, 157, 161, 164, 165, 163, 164, 167, 166, 168], "fill": false, "borderColor": "rgb(99, 203, 137)", "lineTension": 0.1 }] }, "options": {} });
    });
}, 3000);