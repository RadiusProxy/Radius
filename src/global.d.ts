declare global {
    interface Window {
        __uv: any;
        $scramjet: any;
    }
    function $scramjetLoadController(): { ScramjetController: any };
}
export {};
