export default function showToast(message) {
    document.querySelector('.toast-header strong').innerText = message;
    const toast = new bootstrap.Toast(document.querySelector('#liveToast'));
    toast.show();
}