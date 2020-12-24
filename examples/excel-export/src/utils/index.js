export async function exportExcel(header, data, filename) {
    const excel = await
    import ('./Export2Excel')
    excel.export_json_to_excel({
        header,
        data,
        filename
    })
}