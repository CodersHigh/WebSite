 import UIKit
 import PlaygroundSupport
 
 public class HelloViewController: UIViewController{//}, PlaygroundLiveViewSafeAreaContainer {

    var nameLabel = UILabel()
    var mainView = UIView()
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
//    }
//
//    public override func viewDidAppear(_ animated: Bool) {
//        super.viewDidAppear(animated)
        self.view = mainView

        let backImageView = UIImageView(image: UIImage(named: "background_c1p1.png"))
        backImageView.translatesAutoresizingMaskIntoConstraints = false
        backImageView.contentMode = .scaleToFill
        self.view.addSubview(backImageView)
        backImageView.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        backImageView.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
        backImageView.leadingAnchor.constraint(equalTo: self.view.leadingAnchor).isActive = true
        backImageView.trailingAnchor.constraint(equalTo: self.view.trailingAnchor).isActive = true
        
        let earthImageView:UIImageView = UIImageView(image: UIImage(named: "earth.png"))
        earthImageView.translatesAutoresizingMaskIntoConstraints = false
        earthImageView.contentMode = .scaleToFill
        self.view.addSubview(earthImageView)
        
        earthImageView.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
        earthImageView.leadingAnchor.constraint(equalTo: self.view.leadingAnchor).isActive = true
        earthImageView.trailingAnchor.constraint(equalTo: self.view.trailingAnchor).isActive = true
        earthImageView.heightAnchor.constraint(equalTo: self.view.heightAnchor, multiplier: 0.2).isActive = true
        
        
        let captainImageView:UIImageView = UIImageView(image: UIImage(named: "captain_rabbit.png"))
        captainImageView.translatesAutoresizingMaskIntoConstraints = false
        captainImageView.contentMode = .scaleAspectFit
        self.view.addSubview(captainImageView)
        
        captainImageView.bottomAnchor.constraint(equalTo: earthImageView.topAnchor, constant: 60.0).isActive = true
        captainImageView.centerXAnchor.constraint(equalTo: self.view.centerXAnchor).isActive = true
        captainImageView.heightAnchor.constraint(equalTo: self.view.heightAnchor, multiplier: 0.5).isActive = true
        captainImageView.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.4).isActive = true
        
        let passportImageView:UIImageView = UIImageView(image: UIImage(named: "passport_handover.png"))
        passportImageView.translatesAutoresizingMaskIntoConstraints = false
        passportImageView.contentMode = .scaleAspectFit
        self.view.addSubview(passportImageView)
        
        passportImageView.centerYAnchor.constraint(equalTo: captainImageView.centerYAnchor, constant: 40.0).isActive = true
        passportImageView.centerXAnchor.constraint(equalTo: captainImageView.centerXAnchor).isActive = true
        passportImageView.heightAnchor.constraint(equalTo: captainImageView.heightAnchor, multiplier: 0.3).isActive = true
        passportImageView.widthAnchor.constraint(equalTo: captainImageView.widthAnchor, multiplier: 1).isActive = true
        
        
        
    }
    
 }

 extension HelloViewController: PlaygroundLiveViewMessageHandler {
    public func receive(_ message: PlaygroundValue) {
    }
 }

 
