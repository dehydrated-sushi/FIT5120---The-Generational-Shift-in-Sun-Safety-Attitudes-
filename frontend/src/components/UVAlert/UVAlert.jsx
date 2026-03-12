import "./UVAlert.css";

const UVAlert = ({ item }) => {
  return (
    <div className={`uv-card ${item.color}`}>
      <div className="uv-card-header">
        <h3>{item.time}</h3>
        <span className="uv-badge">{item.level}</span>
      </div>

      <div className="uv-main">
        <div className="uv-index">{item.uv}</div>
        <div className="uv-meta">
          <p><strong>Temp:</strong> {item.temp}°C</p>
          <p><strong>Weather:</strong> {item.weather}</p>
        </div>
      </div>

      <div className="uv-warning">
        <p>
          <span className="uv-sign">{item.warning_sign}</span> {item.warning_message}
        </p>
      </div>

      <div className="uv-clothing">
        <h4>Recommended Clothing</h4>
        <ul>
          {item.clothing.map((cloth, index) => (
            <li key={index}>{cloth}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UVAlert;