# Obsidian Word Replacer Plugin

This Obsidian plugin allows you to easily replace a specific word or phrase throughout your entire vault with another word or phrase.  It provides a modal for inputting the word to replace and the replacement text, and offers both a command and a ribbon icon for quick access.

## Features

* **Modal-based Replacement:**  A user-friendly modal allows you to specify the word to replace and its replacement.
* **Vault-wide Replacement:**  The plugin searches and replaces the specified word in all markdown files within your Obsidian vault.
* **Regular Expression Matching (Word Boundaries):** Uses word boundaries (`\b`) in the regular expression to ensure that only whole words are replaced, preventing unintended replacements (e.g., replacing "cat" in "scat" or "category"). Case-insensitive replacement is used.
* **Settings Persistence:** The word to replace and replacement text are saved in the plugin's settings, so you don't have to re-enter them each time.
* **Command and Ribbon Icon:**  Provides both a command and a ribbon icon for easy access to the replacement modal.
* **Error Handling:** Includes basic error handling to catch and display issues during the replacement process.
* **Settings Tab:**  A settings tab is provided to configure the word to replace and the replacement text.

## How to Use

1. **Installation:** Install the plugin through the Obsidian Community Plugins browser.
2. **Configuration:**
    * Open the Obsidian settings.
    * Navigate to the "Community Plugins" tab.
    * Find the "Word Replacer" plugin and click the settings icon.
    * Configure the "Word to Replace" and "Replacement Text" in the settings tab.  These settings are saved.
3. **Running the Replacement:**
    * **Command:** Open the command palette (Ctrl+P or Cmd+P) and type "Replace Word in Vault". Select the command to open the replacement modal.
    * **Ribbon Icon:** Click the dice icon in the Obsidian ribbon to open the replacement modal.
4. **Using the Modal:**
    * The previously configured "Word to Replace" and "Replacement Text" will be pre-filled. You can modify them if needed.
    * Click the "Replace" button to begin the replacement process.
5. **Notifications:**  You will receive a notification when the replacement is complete or if an error occurred.

## Code Explanation

* **`ReplacementModal`:** This class creates the modal that prompts the user for the word to replace and the replacement text.  It handles user input, saves settings, and triggers the replacement process.
* **`replaceInVault`:** This function iterates through all markdown files in the vault, reads their content, performs the replacement using a regular expression with word boundaries, and writes the modified content back to the files.
* **`SampleSettingTab`:** This class creates the plugin's settings tab, allowing users to configure the word to replace and the replacement text.
* **`MyPlugin`:** This is the main plugin class. It loads and saves settings, registers the command and ribbon icon, and creates the settings tab.

## Contributing

Contributions are welcome!  Please submit pull requests or bug reports through the plugin's GitHub repository (if one exists).

## License

[Specify the license under which the plugin is distributed (e.g., MIT, GPL, etc.)]