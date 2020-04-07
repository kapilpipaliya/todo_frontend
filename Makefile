EMOJI_TOOLS_DIR = ./build/emoji

emojis: ## Creates emoji JSON, JSX and Go files and extracts emoji images from the system font
  gem install bundler
  bundle install --gemfile=$(EMOJI_TOOLS_DIR)/Gemfile
  BUNDLE_GEMFILE=$(EMOJI_TOOLS_DIR)/Gemfile SERVER_DIR=$(BUILD_SERVER_DIR) bundle exec $(EMOJI_TOOLS_DIR)/make-emojis
