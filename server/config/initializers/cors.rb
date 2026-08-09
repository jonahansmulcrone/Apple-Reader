# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # The extension calls this API from a background service worker, whose
    # origin is "chrome-extension://<extension-id>". The id is stable per
    # machine for an unpacked/dev-loaded extension but isn't known ahead of
    # time, so we allow any chrome-extension origin. Once the extension is
    # published with a fixed id, tighten this to that exact origin.
    origins(/\Achrome-extension:\/\//)

    resource "/subtitles/*",
      headers: :any,
      methods: [:get, :options]
  end
end
