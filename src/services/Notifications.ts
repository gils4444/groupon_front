import { Notyf } from "notyf";

class Notify {

    private notification = new Notyf({
        dismissible: true, duration: 2500, position: { x: "left", y: "top" }, types: [
            {
                type: 'success',
                background: "LightSkyBlue",
            },
            {
                type: 'error',
                background: 'Maroon'
            }
        ]
    });



    public success(message: string) {
        this.notification.success(message);
    }
    public error(err: any) {
        const message = this.extractMessage(err);
        this.notification.error(message);

    }

    private extractMessage(err: any): string {

        if (typeof err?.response?.data?.message == "string") {
            return err.response.data.message;
        }
        if (typeof err === "string") {
            return err;
        }
        if (typeof err.response?.data == "string") {
            return err.response.data;
        }

        if (Array.isArray(err.response?.data)) {
            return err.response?.data[0];
        }
        // must be last
        if (typeof err?.message === "string") {
            return err.message;
        }
        return "Some error occurred, please try again."
    }
}

const notify = new Notify();

export default notify;
