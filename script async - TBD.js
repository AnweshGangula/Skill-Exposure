var excel_file = './utils/Skill Exposure.xlsx';
let keys


const excelData = await getData(excel_file);
addHTML(excelData);

async function getData(filePath) {
    const response = await fetch(filePath);
    const arrBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrBuffer);
    var workbook = XLSX.read(data, {
        type: "array"
    });

    /* *****************************************************************
    * DO SOMETHING WITH workbook: Converting Excel value to Json       *
    ********************************************************************/
    var first_sheet_name = workbook.SheetNames[0];
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];

    var _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    /************************ End of conversion ************************/

    return _JsonData
}

function addHTML(data) {
    data.forEach(item => {
        {
            var tags = item.Tags;
            const tags_array = tags.split(', ');
            let tagsJson = Object.assign({}, tags_array);

            item.Tags = tags_array
        }

        {
            var category = item.Category;
            const category_array = category.split(', ');
            let catJson = Object.assign({}, category_array);

            item.Category = category_array
        }

    });
    const tableDiv = document.getElementById("mySkills")

    keys = Object.keys(data[0]);

    let heading = ""
    keys.forEach(item => {
        heading += `<th>${item}</th>`
    })

    let searchRow = ""
    keys.forEach(item => {
        searchRow += `<td>
        <input type="text" id="${"search" + item}" onkeyup="filterData(event, this, '${item}')" placeholder="Filter by ${item}.." title="Type in a ${item}">
        </td>`
    })

    $('#mySkills').append(

        `
        <thead>
            <tr>
            ${heading}
            </tr>
            <tr>
            ${searchRow}
            </tr>   
        </thead>
        <tbody id="showExcel">
        </tbody>
        `

    );

    data.forEach(function (item, index) {

        $('#showExcel').append(

            `
            <tr>
                <td scope="row">
                ${item.Description}
                </td>

                <td>
                ${item.Tags.join(', ')}
                </td>

                <td>
                <span class="badge badge-primary badge-pill p-2">
                ${item.Category.join(', ')}
                </span>
                </td>
            </tr>
            `
        );

    });

    console.log(data);
}

// filterData not defined: https://stackoverflow.com/a/57943031/6908282
// since this js file is considered as a module, it doestn support event triggers from HTML - you can use `addEventListener` instead
function filterData(event, element, columnName) {
    // clear on escape key: https://stackoverflow.com/a/3615805/6908282
    let code = event.charCode || event.keyCode;
    if (code == 27) {
        element.value = '';
    }

    if (keys.indexOf(columnName) > 0) {
        const index = keys.indexOf(columnName)

        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById(element.id);
        filter = input.value.toUpperCase();
        table = document.getElementById("mySkills");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[index];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    } else {
        console.log(columnName + " columnName not found");
    }
}