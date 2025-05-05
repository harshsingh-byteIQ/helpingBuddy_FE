export const MusicCols = [
    {
        title: 'S.No',
        dataIndex: 'serial',
        key: 'serial',
        render: (_: any, __: any, index: number) => index + 1,
    },
    {
        title: 'Name',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        render: (record: any) => {
            return <a target="_blank" href={record}>{record}</a>;
        }
    },
]

export const QuestionAnswerCols = [
    {
        title: 'S.No',
        dataIndex: 'serial',
        key: 'serial',
        render: (_: any, __: any, index: number) => index + 1,
    },
    {
        title: 'Question',
        dataIndex: 'question',
        key: 'question',
    },
    {
        title: 'Answer',
        dataIndex: 'answer',
        key: 'answer',
    }
];
