import SwiftUI

struct HTMLText: UIViewRepresentable {
    let html: String
    let width: CGFloat
    
    func makeUIView(context: Context) -> UILabel {
        let label = UILabel()
        label.numberOfLines = 0
        label.lineBreakMode = .byWordWrapping
        label.preferredMaxLayoutWidth = width
        return label
    }
    
    func updateUIView(_ uiView: UILabel, context: Context) {
        uiView.preferredMaxLayoutWidth = width
        
        // Wrap HTML in basic styling to match app theme
        let styledHTML = """
        <style>
            body {
                font-family: -apple-system, system-ui;
                font-size: 17px;
                line-height: 1.6;
                color: #000000;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }
            p { margin-bottom: 16px; }
            strong { font-weight: 600; }
            a { color: #FF4F00; text-decoration: none; }
            h2 { font-size: 22px; font-weight: 700; margin-top: 24px; margin-bottom: 12px; }
            h3 { font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 10px; }
            ul, ol { margin-bottom: 16px; padding-left: 20px; }
            li { margin-bottom: 8px; }
        </style>
        <body>\(html)</body>
        """
        
        if let data = styledHTML.data(using: .utf8) {
            DispatchQueue.main.async {
                if let attributedString = try? NSAttributedString(
                    data: data,
                    options: [.documentType: NSAttributedString.DocumentType.html, .characterEncoding: String.Encoding.utf8.rawValue],
                    documentAttributes: nil
                ) {
                    uiView.attributedText = attributedString
                    uiView.lineBreakMode = .byWordWrapping
                    uiView.numberOfLines = 0
                    uiView.preferredMaxLayoutWidth = width
                }
            }
        }
    }
}
