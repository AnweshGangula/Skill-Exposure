var excel_file = './utils/Skill Exposure.xlsx';
let keys

// read Excel file and convert to json format using fetch
fetch(excel_file)
    .then(function (res) {
        /* get the data as a Blob */
        if (!res.ok) throw new Error("fetch failed");
        return res.arrayBuffer();
    })
    .then(function (ab) {
        /* parse the data when it is received */
        var data = new Uint8Array(ab);
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
        _JsonData.forEach(item => {
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

        keys = Object.keys(_JsonData[0]);

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

        _JsonData.forEach(function (item, index) {

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

    });

function filterData(event, element, columnName) {
    // clear on escape key: https://stackoverflow.com/a/3615805/6908282
    let code = event.charCode || event.keyCode;
    if (code == 27) {
        element.value = '';
    }

    // filter table: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_table
    if (keys.indexOf(columnName) >= 0) {
        const index = keys.indexOf(columnName)

        var input, filter, table, rows, td, i, txtValue;
        input = document.getElementById(element.id);
        filter = input.value.toUpperCase();
        // table = document.getElementById("mySkills");
        // rows = table.getElementsByTagName("tr");
        rows = $('#mySkills tbody tr');
        for (i = 0; i < rows.length; i++) {
            td = rows[i].getElementsByTagName("td")[index];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
        }
    } else {
        console.log(columnName + " columnName not found");
    }
}