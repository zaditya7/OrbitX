import "./StatCard.css";

function StatCard(props) {
    return(
        <div className="stat-card">
            <h3>{props.title}</h3>
            <h1>{props.value}</h1>
        </div>
    );
}
export default StatCard;