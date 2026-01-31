import Swal, { SweetAlertResult } from "sweetalert2";

export const AlertNotification = (
    title: string, 
    text: string,
    icon: "success" | "error" | "warning" | "info" | "question", 
    timer?: number,
    confirm?: true | false
) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: confirm,
      timer: timer,
      customClass: {
        confirmButton: "bg-gradient-to-r from-[#007F73] to-[#40DA97] hover:from-[#4AAF9B] hover:to-[#64B07B] text-white font-bold"
      }
    });
}

export const AlertQuestion = (
    title: string, 
    text: string, 
    icon: "success" | "error" | "warning" | "info" | "question",
    confirmButtonText: string,
    cancelButtonText: string,
): Promise<SweetAlertResult<any>> => {
    return Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      buttonsStyling: true,
      reverseButtons: true,
      customClass: {
        confirmButton: "bg-gradient-to-r from-[#BE1010] to-[#EA5353] hover:from-[#670505] hover:to-[#FF0000] text-white font-bold",
        cancelButton: "bg-gradient-to-r from-[#007F73] to-[#40DA97] hover:from-[#4AAF9B] hover:to-[#64B07B] text-white font-bold",
      }
    });
}
export const AlertQuestion2 = (
    title: string, 
    text: string, 
    icon: "success" | "error" | "warning" | "info" | "question",
    confirmButtonText: string,
    cancelButtonText: string,
): Promise<SweetAlertResult<any>> => {
    return Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#08C2FF',
      cancelButtonText: cancelButtonText,
      cancelButtonColor: '#DA415B',
      reverseButtons: true,
    });
}