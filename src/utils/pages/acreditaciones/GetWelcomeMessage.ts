import Periodos from "./Periodos";

/**
 * De acuerdo al periodo actual de servicio social, regresa el mensaje
 * correspondiente a la duración y número de horas a acreditar de los
 * proyectos
 */
export default function GetWelcomeMessage(): string {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre","Diciembre"
  ];

  const date = new Date();
  const current_day = date.getDate();
  const current_month = date.getMonth();

  let mensaje = null;

  for (let i = 0; i < Periodos.length; i++) {
    const periodo_actual = Periodos[i];
    const start_date = periodo_actual.fecha_inicio.split(" ");
    const end_date = periodo_actual.fecha_fin.split(" ");

    const start_month = meses.indexOf(start_date[0]);
    const start_day = parseInt(start_date[1]);

    const end_month = meses.indexOf(end_date[0]);
    const end_day = parseInt(end_date[1]);

    if (end_month < start_month) { // Between Years
      if (current_month >= start_month || current_month <= end_month) { // Between Period Months
        if (current_month == start_month) { // In Start Month
          if (current_day >= start_day) {
            mensaje = periodo_actual.mensaje;
            break;
          }
        } else if (current_month == end_month) { // In end Month
          if (current_day <= end_day) {
            mensaje = periodo_actual.mensaje;
            break;
          }
        } else { // In Between Months
          mensaje = periodo_actual.mensaje;
          break;
        }
      }
    } else {
      if (current_month >= start_month && current_month <= end_month) {
        if (current_month == start_month) { // In Start Month
          if (current_day >= start_day) {
            mensaje = periodo_actual.mensaje;
            break;
          }
        } else if (current_month == end_month) { // In end Month
          if (current_day <= end_day) {
            mensaje = periodo_actual.mensaje;
            break;
          }
        } else {
          mensaje = periodo_actual.mensaje;
          break;
        }
      }
    }
  }

  return mensaje || "No hay periodo de servicio social activo";
}
