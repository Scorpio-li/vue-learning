let json_fields = {
    // fieldLabel(表头名)，attributeName(对应字段名)
    fieldLabel: attributeName,
    // 使用回调自定义导出数据
    anotherFieldLabel: {
        field: anotherAttributeName,
        callback: (value) => {
            return `formatted value ${value}`;
        },
    },
};

let json_data = [{
        attributeName: value1,
        anotherAttributeName: value2
    },
    {
        attributeName: value3,
        anotherAttributeName: value4
    }
];