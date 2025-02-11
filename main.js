const obsidian = require('obsidian');

class ReplacementModal extends obsidian.Modal {
  constructor(app, settings) {
    super(app);
    this.settings = settings;
    this.plugin = null; // Plugin reference will be set later
  }

  onOpen() {
    const {contentEl} = this;

    contentEl.createEl('h2', {text: 'Replace Word'}); // Create a header for the modal

    // Setting for the word to replace
    new obsidian.Setting(contentEl)
      .setName("Word to Replace")
      .addText(text => text
        .setPlaceholder("Enter word")
        .setValue(this.settings.wordToReplace)
        .onChange(async (value) => {
          this.settings.wordToReplace = value;
          await this.plugin.saveSettings(); // Save settings when the value changes
        }));

    // Setting for the replacement text
    new obsidian.Setting(contentEl)
      .setName("Replacement Text")
      .addText(text => text
        .setPlaceholder("Enter Replacement")
        .setValue(this.settings.replacementText)
        .onChange(async (value) => {
          this.settings.replacementText = value;
          await this.plugin.saveSettings(); // Save settings when the value changes
        }));

    // Button to trigger the replacement process
    new obsidian.Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText('Replace')
          .setCta()
          .onClick(async () => {
            const wordToReplace = this.settings.wordToReplace;
            const replacementText = this.settings.replacementText;

            if (!wordToReplace) {
              new obsidian.Notice("Please enter a word to replace."); // Notify if no word is entered
              return;
            }

            try {
              await this.replaceInVault(wordToReplace, replacementText); // Perform the replacement
              this.close(); // Close the modal
              new obsidian.Notice("Replacement complete."); // Notify on success
            } catch (error) {
              console.error("Error during replacement:", error); // Log error
              new obsidian.Notice("An error occurred during replacement."); // Notify on error
            }
          })
      );
  }

  async replaceInVault(word, replacement) {
    const {vault} = this.app;
    const files = vault.getMarkdownFiles(); // Get all markdown files in the vault

    for (const file of files) {
      const content = await vault.read(file); // Read the file content
      const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Create a regex to match the word
      const newContent = content.replaceAll(regex, replacement); // Replace all occurrences

      if (newContent !== content) {
        await vault.modify(file, newContent); // Save the modified content if changes were made
      }
    }
  }

  onClose() {} // No specific actions on close
}

class SampleSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const {containerEl} = this;

    containerEl.empty(); // Clear the container

    containerEl.createEl('h2', {text: 'Word Replacer Settings'}); // Create a header for the settings tab

    // Setting for the word to replace
    new obsidian.Setting(containerEl)
      .setName('Word to Replace')
      .addText(text => text
        .setPlaceholder('Enter word')
        .setValue(this.plugin.settings.wordToReplace)
        .onChange(async (value) => {
          this.plugin.settings.wordToReplace = value;
          await this.plugin.saveSettings(); // Save settings when the value changes
        }));

    // Setting for the replacement text
    new obsidian.Setting(containerEl)
      .setName('Replacement Text')
      .addText(text => text
        .setPlaceholder('Enter replacement')
        .setValue(this.plugin.settings.replacementText)
        .onChange(async (value) => {
          this.plugin.settings.replacementText = value;
          await this.plugin.saveSettings(); // Save settings when the value changes
        }));
  }
}

module.exports = class MyPlugin extends obsidian.Plugin {
  settings;

  async onload() {
    await this.loadSettings(); // Load settings when the plugin is loaded

    // Add a command to open the replacement modal
    this.addCommand({
      id: 'replace-word',
      name: 'Replace Word in Vault',
      callback: () => {
        const modal = new ReplacementModal(this.app, this.settings);
        modal.plugin = this; // Set the plugin reference
        modal.open(); // Open the modal
      },
    });

    // Add a ribbon icon to open the replacement modal
    this.addRibbonIcon('truck', 'Replace Word in Vault', (evt) => {
      const modal = new ReplacementModal(this.app, this.settings);
      modal.plugin = this; // Set the plugin reference
      modal.open(); // Open the modal
    });

    this.addSettingTab(new SampleSettingTab(this.app, this)); // Add the settings tab
  }

  onunload() {} // No specific actions on unload

  async loadSettings() {
    this.settings = Object.assign({}, { wordToReplace: '', replacementText: '' }, await this.loadData()); // Load settings with default values
  }

  async saveSettings() {
    await this.saveData(this.settings); // Save settings
  }
}