    // Select the dialog and buttons
        const dialog = document.querySelector("dialog");
        const showButton = document.getElementById("show-dialog");
        const closeButton = document.getElementById("close-dialog");
        const copyButton = document.getElementById("copy-code");

        // "Show the dialog" button opens the dialog modally
        showButton.addEventListener("click", () => {
            dialog.showModal();
        });

        // "Hide" button closes the dialog
        closeButton.addEventListener("click", () => {
            dialog.close();
        });

        // "Copy" button copies the code to clipboard
        copyButton.addEventListener("click", () => {
            copyCode();
        });

        function copyCode() {
            const codeElement = document.getElementById('code-block');
            const range = document.createRange();
            range.selectNode(codeElement);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            try {
                document.execCommand('copy');
                alert('The code has been copied to the clipboard!');
            } catch (err) {
                alert('Failed to copy the code.');
            }
            window.getSelection().removeAllRanges();
}