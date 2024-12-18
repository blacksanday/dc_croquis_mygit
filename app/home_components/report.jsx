import Link from "next/link";


//レポートに行く為のボタン
export default function Report(){
    return(
        <div>
            <h2>
                <Link href="report/">Go to Report Page </Link>
            </h2>
        </div>
    );
}