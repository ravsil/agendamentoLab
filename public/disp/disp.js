function createTimeBox(index) {
    let anchor = document.createElement("div");
    anchor.className = "gray collapse";
    anchor.id = index;

    let curHour = new Date().getHours();
    let curMin = new Date().getMinutes();
    let line;
    for (let hour = 8; hour <= 17; hour++) {
        if (hour % 2 == 0) {
            line = document.createElement("div");
            line.className = "justify-content-around row";
            anchor.appendChild(line);
        }
        for (let min = 0; min < 60; min += 30) {
            let formattedHour = ("0" + hour).slice(-2);
            let formattedMin = ("0" + min).slice(-2);

            let wrapperDiv = document.createElement("div");
            wrapperDiv.className = "col-lg-3 col-6 mb-2";
            line.appendChild(wrapperDiv);

            let hourDiv = document.createElement("div");

            if ((curHour < hour) || (curHour == hour && curMin < 30 && min != 0) || (curHour == hour && curMin < 60 && min != 0)) {
                hourDiv.className = "green grower text-center";

            } else {
                hourDiv.className = "dark-gray text-center";
            }
            hourDiv.id = `${index}_${formattedHour}:${formattedMin}`
            hourDiv.innerText = `${formattedHour}:${formattedMin}`;
            wrapperDiv.appendChild(hourDiv);
        }
    }
    return anchor;
}

function turnTimeRed() {
    for (let i = 0; i < 30; i++) {
        $.ajax({
            url: '/get-schedule',
            type: 'POST',
            data: {
                pcId: i,
                date: getDate(true)
            },
            success: function (response) {
                for (let index = 0; index < response.length; index++) {
                    let hour = getIndexHour(response[index].id_inicio)
                    let id = `${i}_${hour}`;
                    let h = JSON.parse(hour.split(":")[0])
                    let m = hour.split(":")[1]
                    while (id != `${i}_${getIndexHour(response[index].id_fim)}`) {
                        if (document.getElementById(id).className != "dark-gray text-center") {
                            document.getElementById(id).className = "red grower text-center";
                        }
                        m = (m == "00") ? "30" : "00";
                        h = (m == "30") ? h : h + 1;
                        id = (h > 9) ? `${i}_${h}:${m}` : `${i}$0{h}:${m}`
                    }
                }
            },
            error: function (error) {
                alert(`[ERRO]!!! ${error}`);
            }
        });
    }
}

function createAll() {
    const curtUrl = new URL(window.location.href);
    const pc = JSON.parse(curtUrl.searchParams.get('pc'));
    let root = document.getElementById("root");
    let row;
    for (let i = 0; i < 30; i++) {
        if (pc != null && pc != i) {
            continue;
        }
        if (i % 3 == 0 || pc == i) {
            row = document.createElement("div");
            row.className = "row";
            root.appendChild(row);
        }
        let col = document.createElement("div");
        col.className = "col-md-4 col-sm-6 col-12";
        row.appendChild(col);

        let title = document.createElement("h3")
        title.className = "text-center soft-btn  bg-dark white-text rounded";
        title.setAttribute("data-toggle", "collapse");
        title.setAttribute("data-target", `#${i}`);
        title.innerText = `Computador ${i}`;
        col.appendChild(title);
        col.appendChild(createTimeBox(i));
    }

    turnTimeRed();
    document.getElementsByTagName("body")[0].style.display = "block";
}


window.addEventListener('load', createAll);