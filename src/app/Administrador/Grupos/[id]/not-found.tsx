import style from "@/app/css/notFount.module.css"

export default function NotFound() {
    return (
        <div className={style.notFound}>
            <h1>404</h1>
            <p>Page Not Found</p>
        </div>
    );
}
