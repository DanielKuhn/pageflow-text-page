# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'pageflow/text_page/version'

Gem::Specification.new do |spec|
  spec.name          = "pageflow-text-page"
  spec.version       = Pageflow::TextPage::VERSION
  spec.authors       = ["Codevise Solutions Ltd."]
  spec.email         = ["info@codevise.de"]
  spec.summary       = "Pageflow Page Type text pages"
  spec.homepage      = "https://github.com/codevise/pageflow-text-page"
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_runtime_dependency 'pageflow', '~> 0.10'

  # Using translations from rails locales in javascript code.
  spec.add_runtime_dependency 'i18n-js'
  spec.add_runtime_dependency 'pageflow-public-i18n', '~> 1.0'

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "rspec-rails", "~> 2.0"
  spec.add_development_dependency 'factory_girl_rails'
  spec.add_development_dependency "sqlite3"

  # Semantic versioning rake tasks
  spec.add_development_dependency 'semmy', '~> 0.2'
end
