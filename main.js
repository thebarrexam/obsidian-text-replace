const obsidian = require('obsidian');

class ReplacementModal extends obsidian.Modal {
  constructor(app, settings) {
    super(app);
    this.settings = settings;
    this.plugin = null;
  }

  onOpen() {
    const {contentEl} = this;

    contentEl.createEl('h2', {text: 'Replace Word'});

    new obsidian.Setting(contentEl)
      .setName("Word to Replace")
      .addText(text => text
        .setPlaceholder("Enter word")
        .setValue(this.settings.wordToReplace)
        .onChange(async (value) => {
          this.settings.wordToReplace = value;
          await this.plugin.saveSettings();
        }));

    new obsidian.Setting(contentEl)
      .setName("Replacement Text")
      .addText(text => text
        .setPlaceholder("Enter Replacement")
        .setValue(this.settings.replacementText)
        .onChange(async (value) => {
          this.settings.replacementText = value;
          await this.plugin.saveSettings();
        }));

    new obsidian.Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText('Replace')
          .setCta()
          .onClick(async () => {
            const wordToReplace = this.settings.wordToReplace;
            const replacementText = this.settings.replacementText;

            if (!wordToReplace) {
              new obsidian.Notice("Please enter a word to replace.");
              return;
            }

            try {
              await this.replaceInVault(wordToReplace, replacementText);
              this.close();
              new obsidian.Notice("Replacement complete.");
            } catch (error) {
              console.error("Error during replacement:", error);
              new obsidian.Notice("An error occurred during replacement.");
            }
          })
      );
  }

  async replaceInVault(word, replacement) {
    const {vault} = this.app;
    const files = vault.getMarkdownFiles();

    for (const file of files) {
      const content = await vault.read(file);
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const newContent = content.replaceAll(regex, replacement);

      if (newContent !== content) {
        await vault.modify(file, newContent);
      }
    }
  }

  onClose() {}
}

class SampleSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const {containerEl} = this;

    containerEl.empty();

    containerEl.createEl('h2', {text: 'Word Replacer Settings'});

    new obsidian.Setting(containerEl)
      .setName('Word to Replace')
      .addText(text => text
        .setPlaceholder('Enter word')
        .setValue(this.plugin.settings.wordToReplace)
        .onChange(async (value) => {
          this.plugin.settings.wordToReplace = value;
          await this.plugin.saveSettings();
        }));

    new obsidian.Setting(containerEl)
      .setName('Replacement Text')
      .addText(text => text
        .setPlaceholder('Enter replacement')
        .setValue(this.plugin.settings.replacementText)
        .onChange(async (value) => {
          this.plugin.settings.replacementText = value;
          await this.plugin.saveSettings();
        }));
  }
}

module.exports = class MyPlugin extends obsidian.Plugin {
  settings;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: 'replace-word',
      name: 'Replace Word in Vault',
      callback: () => {
        const modal = new ReplacementModal(this.app, this.settings);
        modal.plugin = this;
        modal.open();
      },
    });

    this.addRibbonIcon('truck', 'Replace Word in Vault', (evt) => {
      const modal = new ReplacementModal(this.app, this.settings);
      modal.plugin = this;
      modal.open();
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, { wordToReplace: '', replacementText: '' }, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}