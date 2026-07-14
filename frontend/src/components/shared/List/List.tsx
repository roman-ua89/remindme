
interface IItem {
    label: string;
}

interface IProps {
    items: IItem[];
    title: string;
}

export const List = ({items, title}: IProps) => {

    return (
        <div>
            <h1 className="">{title}</h1>
            <ul>
                {items.map(item => {
                    const { label } = item;

                    return (
                        <li>
                            {`${label}`}
                        </li>
                    )
                })}

            </ul>
        </div>
    )
}
