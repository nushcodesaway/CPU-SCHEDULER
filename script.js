function createInputs() {

    let n = document.getElementById("num").value;
    let div = document.getElementById("processInputs");

    div.innerHTML = "";

    for(let i = 1; i <= n; i++) {

        div.innerHTML +=
        `P${i} Arrival:
         <input type="number" id="at${i}">
         Burst:
         <input type="number" id="bt${i}">
         <br>`;
    }
}

/* Show quantum */
document.getElementById("algo").addEventListener("change", function() {

    if(this.value === "rr")
        document.getElementById("quantumDiv").style.display = "block";
    else
        document.getElementById("quantumDiv").style.display = "none";
});


function runScheduler() {

    let n = document.getElementById("num").value;
    let algo = document.getElementById("algo").value;

    let p = [];

    for(let i = 1; i <= n; i++) {

        p.push({
            pid: i,
            at: Number(document.getElementById("at"+i).value),
            bt: Number(document.getElementById("bt"+i).value),
            rt: Number(document.getElementById("bt"+i).value),
            ct: 0, wt: 0, tat: 0
        });
    }

    if(algo === "fcfs")
        fcfs(p);

    else if(algo === "sjf")
        sjf(p);

    else if(algo === "rr") {

        let q = Number(document.getElementById("quantum").value);

        roundRobin(p, q);
    }

    showResult(p);
}


/* ---------- FCFS ---------- */
function fcfs(p) {

    p.sort((a,b)=>a.at-b.at);

    let time = 0;
    let gantt = "";

    for(let i of p){

        if(time < i.at)
            time = i.at;

        gantt += `<span>P${i.pid}</span>`;

        i.wt = time - i.at;

        time += i.bt;

        i.ct = time;

        i.tat = i.ct - i.at;
    }

    document.getElementById("gantt").innerHTML = gantt;
}


/* ---------- SJF ---------- */
function sjf(p){

    let time = 0, done = 0;
    let gantt = [];
    let visited = Array(p.length).fill(false);

    while(done < p.length){

        let idx = -1;
        let min = 9999;

        for(let i=0;i<p.length;i++){

            if(p[i].at <= time && !visited[i] && p[i].bt < min){

                min = p[i].bt;
                idx = i;
            }
        }

        if(idx === -1){
            time++;
        }
        else{

            visited[idx]=true;

            gantt.push(p[idx]);

            p[idx].wt = time - p[idx].at;

            time += p[idx].bt;

            p[idx].ct = time;

            p[idx].tat = p[idx].ct - p[idx].at;

            done++;
        }
    }

    let chart = "";
    gantt.forEach(i=>{
        chart += `<span>P${i.pid}</span>`;
    });

    document.getElementById("gantt").innerHTML = chart;
}


/* ---------- Round Robin ---------- */
function roundRobin(p, q){

    let time=0, done=0;
    let gantt="";

    while(done < p.length){

        let idle=true;

        for(let i of p){

            if(i.rt>0 && i.at<=time){

                idle=false;

                gantt += `<span>P${i.pid}</span>`;

                if(i.rt>q){

                    time+=q;
                    i.rt-=q;
                }
                else{

                    time+=i.rt;
                    i.rt=0;

                    i.ct=time;
                    i.tat=i.ct-i.at;
                    i.wt=i.tat-i.bt;

                    done++;
                }
            }
        }

        if(idle) time++;
    }

    document.getElementById("gantt").innerHTML = gantt;
}


/* ---------- Result Table ---------- */
function showResult(p){

    let html = `<table border="1" cellpadding="5">
    <tr>
    <th>PID</th><th>AT</th><th>BT</th>
    <th>WT</th><th>TAT</th>
    </tr>`;

    let awt=0, atat=0;

    for(let i of p){

        html+=`
        <tr>
        <td>P${i.pid}</td>
        <td>${i.at}</td>
        <td>${i.bt}</td>
        <td>${i.wt}</td>
        <td>${i.tat}</td>
        </tr>`;

        awt+=i.wt;
        atat+=i.tat;
    }

    html+=`</table>`;

    html+=`<p>Average WT = ${(awt/p.length).toFixed(2)}</p>`;
    html+=`<p>Average TAT = ${(atat/p.length).toFixed(2)}</p>`;

    document.getElementById("result").innerHTML = html;
}
